// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function renderHtml(template: string, fields: { [key: string]: string }): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    if (!fields[key]) {
      throw new Error(`Missing data for key: ${key}`);
    }
    return fields[key];
  });
}
