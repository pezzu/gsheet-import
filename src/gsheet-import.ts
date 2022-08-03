import { google, sheets_v4, Auth } from "googleapis";

const params = {
  keyFile: "./credentials.json",
  spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  range: "Class Data!A2:E3",
};

export function createAuth(
  keyFile: string,
  scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
): Auth.GoogleAuth {
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFile,
    scopes: scopes,
  });
  return auth;
}

export async function fetchGSheets(
  auth: Auth.GoogleAuth,
  spreadsheetId: string,
  range: string
): Promise<sheets_v4.Schema$ValueRange> {
  const sheets = google.sheets({ version: "v4", auth });
  const values = sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  });
  return (await values).data;
}

export function toHtmlTable(data: sheets_v4.Schema$ValueRange): string {
  if (!data.values) return "";

  const html = `<table>${data.values
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</table>`;
  return html;
}

export function renderHtml(template: string, data: any): string {
  return template.replace(/{{(.*?)}}/g, (match, key) => data[key]);
}

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
  <h1>{{title}}</h1>
  {{content}}
</body>
</html>
`;

if (require.main === module) {
  async function main(): Promise<void> {
    const auth = createAuth(params.keyFile);
    const values = await fetchGSheets(auth, params.spreadsheetId, params.range);
    const table = toHtmlTable(values);
    const html = renderHtml(HTML_TEMPLATE, { content: table });
    print(html);
  }

  main();
}
