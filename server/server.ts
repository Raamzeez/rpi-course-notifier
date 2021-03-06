import dotenv from "dotenv";
dotenv.config({});
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import Pageclip from "pageclip";
import sgMail from "@sendgrid/mail";
import { sendErrorResponse } from "./util/sendErrorResponse";
import { validateCRN } from "./util/validateCRN";
import { iPageClipFetch } from "./interface/pageClipFetch";
import { iPageClipData } from "./interface/pageClipData";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const pageclip = new Pageclip(process.env.PAGECLIP_API_KEY);
const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send("OK");
});

app.post("/formSubmit", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { email, CRN } = data;
    const validateCRNResponse = await validateCRN(CRN);
    if (!validateCRNResponse) {
      return sendErrorResponse(
        res,
        "Invalid CRN",
        "The CRN provided was invalid because it did not match to a course"
      );
    }
    const pageClipFetch: iPageClipFetch = await pageclip.fetch();
    if (pageClipFetch.status !== 200) {
      return sendErrorResponse(
        res,
        "Fetching Failed",
        "We failed to fetch the data from our database. Please try again."
      );
    }
    pageClipFetch.data.filter((data: iPageClipData) => {
      if (
        data.archivedAt == null &&
        data.payload.email == email &&
        data.payload.CRN == CRN
      ) {
        return sendErrorResponse(
          res,
          "Duplicate",
          `You are already tracking the course with the CRN of ${CRN}`
        );
      }
    });
    const pageClipResponse = await pageclip.send({ email, CRN });
    if (pageClipResponse.status !== 200) {
      console.error(pageClipResponse);
      return sendErrorResponse(
        res,
        "Internal Server Error",
        "Our server encountered an issue with storing your data. Please try again",
        pageClipResponse.status
      );
    }
    const message = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: "Email Confirmation",
      text: "Your account has been set up.",
    };
    const sgMailResponse = await sgMail.send(message);
    const sendGridResponse = sgMailResponse[0];
    if (
      sendGridResponse.statusCode < 200 &&
      sendGridResponse.statusCode > 299
    ) {
      console.error(sendGridResponse);
      return sendErrorResponse(
        res,
        "Email Confirmation Error",
        "Our email service is not working. Please try again later."
      );
    }
    return res.status(200).send(validateCRNResponse);
  } catch (err) {
    console.error(err);
    return sendErrorResponse(
      res,
      "Internal Server Error",
      "Our server encountered an issue. Please try again",
      400
    );
  }
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
