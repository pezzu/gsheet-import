import { createAuth, fetchGSheets } from "./lib/gsheet";
import { toHtmlTable, renderHtml } from "./lib/html";

const params = {
  keyFile: "./credentials.json",
  spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  range: "Class Data!A2:E3",
};

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
    const auth = createAuth(params.keyFile);
    const values = await fetchGSheets(auth, params.spreadsheetId, params.range);
    const table = toHtmlTable(values.values || [[]]);
    const html = renderHtml(HTML_TEMPLATE, { content: table });
    print(html);
  } catch (e) {
    console.error(e);
  }
}

main();
