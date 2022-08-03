import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export type Transport = {
  host: string;
  port: number;
};

export type Message = {
  from: string;
  to: string;
  cc: string;
  subject: string;
  html: string;
};

export async function sendMail(transport: Transport, message: Message): Promise<SMTPTransport.SentMessageInfo> {
  const transporter = createTransport(transport);
  const mail = transporter.sendMail(message);
  return mail;
}
