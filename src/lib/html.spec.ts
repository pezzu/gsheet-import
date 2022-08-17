import { JSDOM } from "jsdom";
import { toHtmlTable, renderHtml } from "./html";

describe("Generates HTML", () => {
  it("Should generate a HTML table", () => {
    const data = [
      ["1-1", "1-2", "1-3", "1-4"],
      ["2-1", "2-2", "2-3", "2-4"],
      ["3-1", "3-2", "3-3", "3-4"],
    ];

    const html = toHtmlTable(data);
    const dom = new JSDOM(html);

    expect(dom.window.document.body.children.length).toEqual(1);

    const table = dom.window.document.querySelector("table");
    expect(table).toBeTruthy();
    expect(table!.children[0].tagName).toEqual("TBODY");
    expect(table!.children[0].children.length).toEqual(3);

    Array.from(table!.children[0].children).forEach((row, i) => {
      expect(row.children.length).toEqual(4);
      expect(row.tagName).toEqual("TR");
      Array.from(row.children).forEach((cell, j) => {
        if(i > 0) {
          expect(cell.tagName).toEqual("TD");
        }
        expect(cell.textContent).toEqual(`${i + 1}-${j + 1}`);
      });
    });
  });

  it("Should generate 1st row as HTML table header", () => {
    const data = [
      ["H1", "H2", "H3", "H4"],
      ["1-1", "1-2", "1-3", "1-4"],
      ["2-1", "2-2", "2-3", "2-4"],
      ["3-1", "3-2", "3-3", "3-4"],
    ];

    const html = toHtmlTable(data);
    const dom = new JSDOM(html);

    const table = dom.window.document.querySelector("table");
    expect(table).toBeTruthy();
    expect(table!.children[0].tagName).toEqual("TBODY");
    expect(table!.children[0].children.length).toEqual(4);
    expect(table!.children[0].children[0].tagName).toEqual("TR");

    const header = table!.children[0].children[0];
    expect(header.children.length).toEqual(4);
    Array.from(header.children).forEach((cell, j) => {
      expect(cell.tagName).toEqual("TH");
      expect(cell.textContent).toEqual(`H${j + 1}`);
    });
  });
});

describe("Renders documents from templates", () => {
  it("Should render mustache templates with multiple keys", () => {
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
      content: "<p>World</p>",
    };
    const html = renderHtml(template, data);
    const dom = new JSDOM(html);
    expect(dom.window.document.body.children.length).toEqual(2);
    expect(dom.window.document.querySelector("h1")!.textContent).toEqual("Hello");
    expect(dom.window.document.querySelector("p")!.textContent).toEqual("World");
  });

  it("Throws an error if data misses a key", () => {
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
    };
    expect(() => renderHtml(template, data)).toThrow();
  });
});
