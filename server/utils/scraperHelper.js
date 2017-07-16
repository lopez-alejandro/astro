import cheerio from 'cheerio';
import tableToCsv from 'node-table-to-csv';

// parses the table from the nfl website using cheerio
export async function getTable(data) {
  const $ = cheerio.load(data);
  const table = '<table>' + $('table').html() + '</table>';
  return table;
}

export function getCsv(table, removeHeaders) {
  let csv = tableToCsv(table);
  if(removeHeaders) {
    csv = csv.substring(csv.indexOf('\n') + 1);
    csv = csv.substring(csv.indexOf('\n') + 1);
  }
  return csv;
}
