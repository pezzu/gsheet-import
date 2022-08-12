export function toHtmlTable(data: any[][]): string {
  const html =
    "<table>\n" +
    "   <tr>\n" +
    data[0].map((cell) => `     <th>${cell}</th>\n`).join("") +
    "   </tr>\n" +
    data
      .slice(1)
      .map((row) =>
      "   <tr>\n" +
      row.map((cell) => `     <td>${cell}</td>\n`).join("") +
      "   </tr>\n")
      .join("") +
    "</table>";
  return html;
}

export function renderHtml(template: string, data: any): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    if (!data[key]) {
      throw new Error(`Missing data for key: ${key}`);
    }
    return data[key];
  });
}
