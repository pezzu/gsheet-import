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
  return template.replace(/{{(.*?)}}/g, (match, key) => data[key]);
}
