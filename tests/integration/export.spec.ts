import "dotenv/config";
import { execFileSync } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { CreateInboxDtoInboxTypeEnum, MailSlurp } from "mailslurp-client";
import { Configuration } from "../../src/lib/config";
import { nextName, cleanup } from "../lib/tmpname";

const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY! });

jest.setTimeout(30000);

async function createCredentialsFile(fileName: string): Promise<void> {
  return writeFile(fileName, process.env.GCP_ACCESS_CREDENTIALS!);
}

async function writeConfigFile(fileName: string, config: string): Promise<void> {
  return writeFile(fileName, config);
}

async function createInbox() {
  return mailslurp.createInboxWithOptions({
    inboxType: CreateInboxDtoInboxTypeEnum.SMTP_INBOX,
    virtualInbox: true,
    expiresIn: 5 * 60_000,
  });
}

function generateConfig(credentials, emailHeader, transport): Configuration {
  const config: Configuration = {
    credentials: credentials,
    sheet: {
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      range: "Class Data!A2:E5",
    },
    notification: {
      email: {
        transport: transport,
        header: emailHeader,
        message: {
          templateFile: "templates/message.html",
          fields: {
            title: "Test Title for the message",
          },
        },
      },
    },
  };

  return config;
}

describe("Command line utility exports data to HTML and send email", () => {
  afterAll(async () => {
    return cleanup();
  });

  it("Should export data from spreadsheet and send email with data", async () => {
    const credentialsFileName = nextName();
    const credentials = {
      keyFile: credentialsFileName,
    };
    await createCredentialsFile(credentialsFileName);

    const inbox = await createInbox();
    const transportOpts = {
      host: "mx.mailslurp.com",
      port: 2525,
      secure: false,
    };
    const emailHeader = {
      from: "bot@domain.com",
      to: inbox.emailAddress,
      subject: "Mail Subject",
    };

    const config = generateConfig(credentials, emailHeader, transportOpts);
    const configFileName = nextName();
    await writeConfigFile(configFileName, JSON.stringify(config));

    const output = execFileSync("node", ["dist/gsheet-import.js", configFileName]);
    const emails = await mailslurp.inboxController.getEmails({ inboxId: inbox.id });

    expect(output.toString()).toEqual("Mail sent to " + inbox.emailAddress + "\n");
    expect(emails.length).toEqual(1);
    expect(emails[0].subject).toEqual(emailHeader.subject);
    expect(emails[0].to).toEqual([inbox.emailAddress]);
    expect(emails[0].from).toEqual(emailHeader.from);
  });
});
