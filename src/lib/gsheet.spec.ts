import "dotenv/config";
import { writeFile, unlink, NoParamCallback } from "fs";
import { createAuth, fetch } from "./gsheet";

const CREDENTIALS_FILE = "test_credentials.json";
// see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
const GOOGLE_TEST_CHEET = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";

function createCredentialsFile(done: NoParamCallback) {
  writeFile(CREDENTIALS_FILE, process.env.GCP_ACCESS_CREDENTIALS!, done);
}

function deleteCredentialsFile(done: NoParamCallback) {
  unlink(CREDENTIALS_FILE, done);
}

describe("Imports data from Google Sheets to HTML", () => {
  beforeAll((done: NoParamCallback) => {
    createCredentialsFile(done);
  });

  afterAll((done: NoParamCallback) => {
    deleteCredentialsFile(done);
  });

  it("Should fetch cells values from Google Sheets usign GoogleAuth for authentication", async () => {
    const auth = createAuth({ keyFile: CREDENTIALS_FILE });
    const data = await fetch(auth, {
      spreadsheetId: GOOGLE_TEST_CHEET,
      range: "Class Data!A2:E5",
    });
    expect(data).toEqual([
      ["Alexandra", "Female", "4. Senior", "CA", "English"],
      ["Andrew", "Male", "1. Freshman", "SD", "Math"],
      ["Anna", "Female", "1. Freshman", "NC", "English"],
      ["Becky", "Female", "2. Sophomore", "SD", "Art"],
    ]);
  });

  it("Should fetch cells values from Google Sheets usign AuthOptions for authentication", async () => {
    const data = await fetch(
      { keyFile: CREDENTIALS_FILE },
      {
        spreadsheetId: GOOGLE_TEST_CHEET,
        range: "Class Data!A2:E5",
      }
    );
    expect(data).toEqual([
      ["Alexandra", "Female", "4. Senior", "CA", "English"],
      ["Andrew", "Male", "1. Freshman", "SD", "Math"],
      ["Anna", "Female", "1. Freshman", "NC", "English"],
      ["Becky", "Female", "2. Sophomore", "SD", "Art"],
    ]);
  });

  it("Should return empty array if cells not contain any values", async () => {
    const cells = await fetch(
      { keyFile: CREDENTIALS_FILE },
      {
        spreadsheetId: GOOGLE_TEST_CHEET,
        range: "Class Data!A34:E40",
      }
    );

    expect(cells).toEqual([]);
  });

  it("Should throw if auth param neither GoogleAuth nor AuthOptions", () => {
    const auth = {
      something: "else",
    };

    expect(() =>
      fetch(auth as any, { spreadsheetId: GOOGLE_TEST_CHEET, range: "Class Data!A2:E5" })
    ).rejects.toThrow();
  });
});
