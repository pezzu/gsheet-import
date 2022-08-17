import { google, Auth } from "googleapis";

export type AuthOptions = {
  keyFilename?: string;
  keyFile?: string;
  credentials?: {
    client_email?: string;
    private_key?: string;
  };
  scopes?: string | string[];
};

export type SheetOptions = {
  spreadsheetId?: string;
  range?: string;
};

export function createAuth(authOpts: Auth.GoogleAuth | AuthOptions): Auth.GoogleAuth {
  if (authOpts instanceof Auth.GoogleAuth) {
    return authOpts;
  } else if (authOpts.keyFile || authOpts.keyFilename || authOpts.credentials) {
    const scopes = authOpts.scopes ?? ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    return new google.auth.GoogleAuth({ ...authOpts, scopes });
  } else {
    throw new Error("Invalid auth options type");
  }
}

export async function fetch(
  authOpts: Auth.GoogleAuth | AuthOptions,
  sheetOpts: SheetOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[][]> {
  const auth = createAuth(authOpts);
  const sheets = google.sheets({ version: "v4", auth });
  const cells = await sheets.spreadsheets.values.get(sheetOpts);
  if (!cells.data.values) return [];
  return adjustRowsLength(cells.data.values);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adjustRowsLength(rows: any[][]): any[][] {
  const maxLength = rows.reduce((max, row) => Math.max(max, row.length), 0);
  return rows.map((row) => [...row, ...Array(maxLength - row.length).fill("")]);
}
