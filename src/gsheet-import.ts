import { readFileSync } from "fs";
import { fetch } from "./lib/gsheet";
import { toHtmlTable, renderHtml } from "./lib/html";
import { sendMail } from "./lib/mail";

function print(data: any): void {
  console.log(data);
}

async function main(): Promise<void> {
  try {
    const params = JSON.parse(readFileSync("app-settings.json", "utf8"));

    const cells = await fetch(params.credentials, params.sheet);
    if (cells.length > 1) {
      const table = toHtmlTable(cells);
      const template = readFileSync(params.mail.template.file, "utf8");
      const html = renderHtml(template, { ...params.mail.template.fields, content: table });
      await sendMail(params.mail.transport, { ...params.mail.message, html });
      print(`Mail sent to ${params.mail.message.to}`);
    }
  } catch (e) {
    console.error(e);
  }
}

main();
