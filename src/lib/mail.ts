import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export type TransportOpts = {
  host: string;
  port: number;
};

export type Message = {
  from?: string;
  to?: string;
  cc?: string;
  subject?: string;
  html?: string;
};

function createTransporter(transport: TransportOpts | Transporter): Transporter {
  if ((transport as TransportOpts).host !== undefined) {
    return createTransport(transport);
  }
  else if(typeof (transport as Transporter).sendMail === 'function') {
    return transport as Transporter;
  }
  else {
    throw new Error("Invalid transport type");
  }
}

export async function sendMail(transport: TransportOpts | Transporter, message: Message): Promise<SMTPTransport.SentMessageInfo> {
  const transporter = createTransporter(transport);
  const mail = transporter.sendMail(message);
  return mail;
}
