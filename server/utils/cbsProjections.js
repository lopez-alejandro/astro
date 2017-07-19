/**
 * Downloads player projections from the CBS website and converts them
 * into a CSV file to be consumed later for our calculations
 */
import fetch from 'node-fetch';
import fs from 'fs';
import tableToCsv from 'node-table-to-csv';
import { getTable} from './scraperHelper';
const path = require('path');

export const POSITIONS = {
  QB: 'QB',
  RB: 'RB',
  WR: 'WR',
  TE: 'TE',
  K: 'K',
  DEF: 'DST',
};

export const CBS_URL = 'http://fantasynews.cbssports.com/fantasyfootball/stats/weeklyprojections/';

const CBS_TIME_FRAME = 'season';

export function getCsv(table, removeHeaders) {
  let csv = tableToCsv(table);
  if(removeHeaders) {
    csv = csv.substring(csv.indexOf('\n') + 1);
    csv = csv.substring(csv.indexOf('\n') + 1);

  }
  return csv;
}

export async function getHtml(url, position, page) {
  let pageOffset = page * 50 + 1;
  // modify the url so it displays the right page and position
  url += `${POSITIONS[position]}?start_row=${pageOffset}`;

  let response = await fetch(url);
  let data = await response.text();
  return data;
}

// converts the given table to a csv file and saves it on the server
export async function storeAsCsv(csv, position) {
  let dir = path.join(__dirname, "../../../", "");
  switch(position) {
    case POSITIONS['QB']:
      dir = dir + 'data/projections/cbs/cbs_projections_qb.csv';
      break;
    case POSITIONS['RB']:
      dir = dir + 'data/projections/cbs/cbs_projections_rb.csv';
      break;
    case POSITIONS['WR']:
      dir = dir + 'data/projections/cbs/cbs_projections_wr.csv';
      break;
    case POSITIONS['TE']:
      dir = dir + 'data/projections/cbs/cbs_projections_te.csv';
      break;
    case POSITIONS['K']:
      dir = dir + 'data/projections/cbs/cbs_projections_k.csv';
      break;
    case POSITIONS['DEF']:
      dir = dir + 'data/projections/cbs/cbs_projections_def.csv';
      break;
    default:
      dir = dir + 'data/projections/cbs/cbs_projections_qb.csv';
      break;
  }
  fs.writeFile(dir, csv, function(err){
    if(err){
      console.log(err);
    }
    console.log('saved!');
  });
}

export async function get_cbs_projections() {
  let csv = '';
  let data;
  let table;

  // get QB data
  for(var i = 0; i < 2; i++) {
    data = await getHtml(CBS_URL, 'QB', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }
  storeAsCsv(csv, 'QB');
  csv = '';

  // get RB data
  for(var i = 0; i < 3; i++) {
    data = await getHtml(CBS_URL, 'RB', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }
  storeAsCsv(csv, 'RB');
  csv = '';

  // get WR data
  for(var i = 0; i < 4; i++) {
    data = await getHtml(CBS_URL, 'WR', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }
  storeAsCsv(csv, 'WR');
  csv = '';

  // get TE data
  for(var i = 0; i < 2; i++) {
    data = await getHtml(CBS_URL, 'TE', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }
  storeAsCsv(csv, 'TE');
  csv = '';

  // get K data
  for(var i = 0; i < 1; i++) {
    data = await getHtml(CBS_URL, 'K', i);
    table = await getTable(data);
    let removeHeaders = false;

    csv += getCsv(table, false);
  }
  storeAsCsv(csv, 'K');
  csv = '';

  // get DEF data
  for(var i = 0; i < 1; i++) {
    data = await getHtml(CBS_URL, 'DEF', i);
    table = await getTable(data);
    let removeHeaders = false;

    csv += getCsv(table, false);
  }
  storeAsCsv(csv, 'DST');
  csv = '';

  return true;
}
