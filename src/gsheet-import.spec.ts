import { JSDOM } from 'jsdom';
import { createAuth, fetchGSheets, toHtmlTable, renderHtml } from "./gsheet-import";

describe("Imports data from Google Sheets to HTML", () => {
  /**
   * Google sample spreadsheet:
   * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  it("Should fetch cells values from Google Sheets", async () => {
    const auth = createAuth("./credentials.json");
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

  it("Should two dimesional array to HTML table", () => {
    const data = {
      values: [
        ["1-1", "1-2", "1-3", "1-4"],
        ["2-1", "2-2", "2-3", "2-4"],
        ["3-1", "3-2", "3-3", "3-4"],
      ]
    }

    const html = toHtmlTable(data);
    const dom = new JSDOM(html);

    expect(dom.window.document.body.children.length).toEqual(1);

    const table = dom.window.document.querySelector("table");
    expect(table).toBeTruthy();
    expect(table!.children[0].tagName).toEqual("TBODY");
    expect(table!.children[0].children.length).toEqual(3);

    Array.from(table!.children[0].children).forEach((row, i) => {
      expect(row.children.length).toEqual(4);
      Array.from(row.children).forEach((cell, j) => {
        expect(cell.textContent).toEqual(`${i+1}-${j+1}`);
      });
    })
  })

  it("Should render mustache templates", () => {
    const template = `
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
    const data = {
      title: "Hello",
      content: "<p>World</p>"
    }
    const html = renderHtml(template, data);
    const dom = new JSDOM(html);
    expect(dom.window.document.body.children.length).toEqual(2);
    expect(dom.window.document.querySelector("h1")!.textContent).toEqual("Hello");
    expect(dom.window.document.querySelector("p")!.textContent).toEqual("World");
  })
});
