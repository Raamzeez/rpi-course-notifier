import { iPageClipFetch } from "./interface/pageClipFetch";
import Pageclip from "pageclip";
import { iPageClipData } from "./interface/pageClipData";
import { isSeatOpen } from "./util/isSeatOpen";
import { validateCRN } from "./util/validateCRN";
import sgMail from "@sendgrid/mail";

const pageclip = new Pageclip(process.env.PAGECLIP_API_KEY);

const notify = async () => {
  const pageClipFetch: iPageClipFetch = await pageclip.fetch();
  if (pageClipFetch.status !== 200) {
    return; //Error handling here
  }
  pageClipFetch.data.filter(async (data: iPageClipData) => {
    if (data.archivedAt == null) {
      const CRN = parseInt(data.payload.CRN);
      const validateCRNResponse = await validateCRN(CRN);
      if (isSeatOpen(CRN, validateCRNResponse)) {
        const message = {
          to: data.payload.email,
          from: process.env.FROM_EMAIL,
          subject: `Your Course (${validateCRNResponse.title}) Has An Open Seat!`,
          text: "Hurry now and register for your course so that you don't miss out!",
        };
        const sgMailResponse = await sgMail.send(message);
        const sendGridResponse = sgMailResponse[0];
        if (
          sendGridResponse.statusCode < 200 &&
          sendGridResponse.statusCode > 299
        ) {
          console.error(sendGridResponse);
          return; //Error handling here
        }
      }
    }
  });
};
notify();
