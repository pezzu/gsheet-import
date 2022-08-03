import { google, sheets_v4, Auth } from "googleapis";


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
