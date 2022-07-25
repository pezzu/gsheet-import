import { google, sheets_v4, Auth } from "googleapis";

const params = {
  keyFile: "./credentials.json",
  spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  range: "Class Data!A2:E",
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

function print(data: sheets_v4.Schema$ValueRange): void {
  console.log(data.values);
}

if (require.main === module) {
  function main(): void {
    const auth = createAuth(params.keyFile);
    const values = fetchGSheets(auth, params.spreadsheetId, params.range);
    values.then(print);
  }

  main();
}
