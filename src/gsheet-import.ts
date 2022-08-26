import { readFileSync } from "fs";
import { fetch } from "./lib/gsheet";
import { toHtmlTable, renderHtml } from "./lib/html";
import { sendMail } from "./lib/mail";
import { readConfig } from "./lib/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function print(data: any): void {
  console.log(data);
}

async function main(): Promise<void> {
  const params = readConfig("app-settings.json");

  params.forEach(async (param) => {
    try {
      const cells = await fetch(param.credentials, param.sheet);
      if (cells.length > 1) {
        const table = toHtmlTable(cells);
        const template = readFileSync(param.notification.message.templateFile, "utf8");
        const html = renderHtml(template, { ...param.notification.message.fields, content: table });
        await sendMail(param.notification.email.transport, { ...param.notification.email.header, html });
        print(`Mail sent to ${param.notification.email.header.to}`);
      }
    } catch (e) {
      console.error(e);
    }
  });
}

main();
