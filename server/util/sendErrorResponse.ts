import { Response } from "express";

export function sendErrorResponse(
  res: Response,
  name: string,
  message: string,
  status: number = 400
) {
  return res.status(status).send({
    name,
    message,
  });
}
