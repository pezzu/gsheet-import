import * as nodemailer from "nodemailer";
import { sendMail } from "./mail";
jest.mock("nodemailer");

describe("Sends an email", () => {
  it("Should send an email with Transporter object provided", async () => {
    const transport = {
      sendMail: jest.fn(() => Promise.resolve({ messageId: "42" })),
    };

    const message = {
      from: "user@domain.com",
      to: "afriend@domain.com",
      cc: "urmom@domain.com",
      subject: "Hello",
      html: "<p>World</p>",
    };

    const sentMessage = await sendMail(transport as unknown as nodemailer.Transporter, message);
    expect(transport.sendMail).toHaveBeenCalledWith(message);
    expect(sentMessage.messageId).toEqual("42");
  });

  it("Should send an email with TransportOpts object provided", async () => {
    const sendMailMock = jest.fn(() => Promise.resolve({ messageId: "24" }));
    (nodemailer.createTransport as any).mockReturnValue({ sendMail: sendMailMock });

    const transport = {
      host: "smtp.example.com",
      port: 587,
    };

    const message = {
      from: "user@domain.com",
      to: "afriend@domain.com",
      cc: "urmom@domain.com",
      subject: "Hello",
      html: "<p>World</p>",
    };

    const sentMessage = await sendMail(transport, message);
    expect(sendMailMock).toHaveBeenCalledWith(message);
    expect(sentMessage.messageId).toEqual("24");
  });

  it("Should throw an error if invalid transport type is provided", async () => {
    const transport = {
      tel: "123-456-7890",
      sms: () => 42,
    };

    const message = {
      from: "user@domain.com",
      to: "afriend@domain.com",
      cc: "urmom@domain.com",
      subject: "Hello",
      html: "<p>World</p>",
    };

    expect(async () => await sendMail(transport as any, message)).rejects.toThrow("Invalid transport type");
  });
});
