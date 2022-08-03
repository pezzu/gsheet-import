import "dotenv/config";
import { writeFile, unlink, NoParamCallback } from "fs";
import { createAuth, fetchGSheets } from "./gsheet";

const CREDENTIALS_FILE = "test_credentials.json";

function createCredentialsFile(done: NoParamCallback) {
  writeFile(CREDENTIALS_FILE, process.env.GCP_ACCESS_CREDENTIALS!, done);
}

function deleteCredentialsFile(done: NoParamCallback) {
  unlink(CREDENTIALS_FILE, done);
}

describe("Imports data from Google Sheets to HTML", () => {

  beforeAll((done: NoParamCallback) => {
    createCredentialsFile(done);
  })

  afterAll((done: NoParamCallback) => {
    deleteCredentialsFile(done);
  })

  /**
   * Google sample spreadsheet:
   * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  it("Should fetch cells values from Google Sheets", async () => {

    const auth = createAuth(CREDENTIALS_FILE);
    const data = await fetchGSheets(
      auth,
      "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      "Class Data!A2:E5"
    );
    expect(data.values).toEqual([
      ["Alexandra", "Female", "4. Senior", "CA", "English"],
      ["Andrew", "Male", "1. Freshman", "SD", "Math"],
      ["Anna", "Female", "1. Freshman", "NC", "English"],
      ["Becky",	"Female",	"2. Sophomore",	"SD",	"Art"],
    ]);
  });
});
