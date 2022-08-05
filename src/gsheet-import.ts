import { readFileSync } from "fs";
import { fetch } from "./lib/gsheet";
import { toHtmlTable, renderHtml } from "./lib/html";
import { sendMail } from "./lib/mail";

function print(data: any): void {
  console.log(data);
}

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
{{content}}
</body>
</html>
`;

async function main(): Promise<void> {
  try {
    const params = JSON.parse(readFileSync("app-settings.json", "utf8"));

    const values = await fetch(params.credentials, params.sheet);
    const cells = values?.values ?? [];
    if (cells.length > 0) {
      const table = toHtmlTable(cells);
      const html = renderHtml(HTML_TEMPLATE, { content: table });
      await sendMail(params.mail.transport, { ...params.mail.message, html });
      print(`Mail sent to ${params.mail.message.to}`);
    }
  } catch (e) {
    console.error(e);
  }
}

main();
