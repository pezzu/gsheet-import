export function toHtmlTable(data: any[][]): string {
  const html = `
    <table>
      ${data.map(
        (row) => `
        <tr>
          ${row.map((cell) => `<td>${cell}</td>`).join("")}
        </tr>`
      ).join("")}
    </table>`;
  return html;
}

export function renderHtml(template: string, data: any): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    if(!data[key]) {
      throw new Error(`Missing data for key: ${key}`);
    }
    return data[key]
  });
}
