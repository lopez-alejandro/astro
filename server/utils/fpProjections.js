/**
 * Downloads player projections from the Fantasy Pros website and converts them
 * into a CSV file to be consumed later for our calculations
 */
import fetch from 'node-fetch';
import fs from 'fs';
import tableToCsv from 'node-table-to-csv';
import { getTable} from './scraperHelper';
const path = require('path');

export const POSITIONS = {
  QB: 'qb',
  RB: 'rb',
  WR: 'wr',
  TE: 'te',
  K: 'k',
  DEF: 'dst',
};

export const FP_URL = 'https://www.fantasypros.com/nfl/projections/';
export const FP_END = '.php?week=draft';

export function getCsv(table, removeHeaders) {
  let csv = tableToCsv(table);
  if(removeHeaders) {
    csv = csv.substring(csv.indexOf('\n') + 1);
    csv = csv.substring(csv.indexOf('\n') + 1);

  }
  return csv;
}

export async function getHtml(url, position) {
  // modify the url so it displays the right page and position
  url += `${POSITIONS[position]}${FP_END}`;

  let response = await fetch(url);
  let data = await response.text();
  return data;
}

// converts the given table to a csv file and saves it on the server
export async function storeAsCsv(csv, position) {
  let dir = path.join(__dirname, "../../../", "");
  switch(position) {
    case POSITIONS['QB']:
      dir = dir + 'data/projections/fp/fp_projections_qb.csv';
      break;
    case POSITIONS['RB']:
      dir = dir + 'data/projections/fp/fp_projections_rb.csv';
      break;
    case POSITIONS['WR']:
      dir = dir + 'data/projections/fp/fp_projections_wr.csv';
      break;
    case POSITIONS['TE']:
      dir = dir + 'data/projections/fp/fp_projections_te.csv';
      break;
    case POSITIONS['K']:
      dir = dir + 'data/projections/fp/fp_projections_k.csv';
      break;
    case POSITIONS['DEF']:
      dir = dir + 'data/projections/fp/fp_projections_def.csv';
      break;
    default:
      dir = dir + 'data/projections/fp/fp_projections_qb.csv';
      break;
  }
  fs.writeFile(dir, csv, function(err){
    if(err){
      console.log(err);
    }
    console.log('saved!');
  });
}

export async function get_fp_projections() {
  let csv = '';
  let data;
  let table;

  // get QB data
  data = await getHtml(FP_URL, 'QB');
  table = await getTable(data);
  csv += getCsv(table, false);
  storeAsCsv(csv, POSITIONS['QB']);
  csv = '';

  // get RB data
  data = await getHtml(FP_URL, 'RB');
  table = await getTable(data);
  csv += getCsv(table, false);
  storeAsCsv(csv, POSITIONS['RB']);
  csv = '';

  // get WR data
  data = await getHtml(FP_URL, 'WR');
  table = await getTable(data);
  csv += getCsv(table, false);
  storeAsCsv(csv, POSITIONS['WR']);
  csv = '';

  // get TE data
  data = await getHtml(FP_URL, 'TE');
  table = await getTable(data);
  csv += getCsv(table, false);
  storeAsCsv(csv, POSITIONS['TE']);
  csv = '';

  // get K data
  data = await getHtml(FP_URL, 'K');
  table = await getTable(data);
  csv += getCsv(table, false);
  storeAsCsv(csv, POSITIONS['K']);
  csv = '';

  // get DEF data
  data = await getHtml(FP_URL, 'DEF');
  table = await getTable(data);
  csv += getCsv(table, false);
  storeAsCsv(csv, POSITIONS['DEF']);
  csv = '';

  return true;
}
