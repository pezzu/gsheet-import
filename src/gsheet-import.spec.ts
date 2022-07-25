import { createAuth, fetchGSheets } from "./gsheet-import";

describe("Imports data from Google Sheets", () => {
  /**
   * Google sample spreadsheet:
   * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  it("should import data from Google Sheets", async () => {
    const auth = createAuth("./credentials.json");
    const values = await fetchGSheets(
      auth,
      "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      "Class Data!A2:E5"
    );
    expect(values.values).toEqual([
      ["Alexandra", "Female", "4. Senior", "CA", "English"],
      ["Andrew", "Male", "1. Freshman", "SD", "Math"],
      ["Anna", "Female", "1. Freshman", "NC", "English"],
      ["Becky",	"Female",	"2. Sophomore",	"SD",	"Art"],
    ]);
  });
});
