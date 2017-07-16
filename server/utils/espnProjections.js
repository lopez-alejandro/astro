/**
 * Downloads player projections from the ESPN website and converts them
 * into a CSV file to be consumed later for our calculations
 */
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';
import tableToCsv from 'node-table-to-csv';
const path = require('path');

export const POSITIONS = {
  QB: 0,
  RB: 2,
  WR: 4,
  TE: 6,
  K: 17,
  DEF: 16,
};

export const ESPN_URL = 'http://games.espn.go.com/ffl/tools/projections?&seasonTotals=true&seasonId=2017';

// parses the table from the nfl website using cheerio
export async function getTable(data) {
  const $ = cheerio.load(data);
  const table = '<table>' + $('table .playerTableTable').html() + '</table>';
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

export async function getHtml(url, position, page) {
  let pageOffset = page * 40;
  // modify the url so it displays the right page and position
  url += `&slotCategoryId=${POSITIONS[position]}&startIndex=${pageOffset}`;

  let response = await fetch(url);
  let data = await response.text();
  return data;
}

// converts the given table to a csv file and saves it on the server
export async function storeAsCsv(csv, position) {
  let dir = path.join(__dirname, "../../../", "");
  switch(position) {
    case POSITIONS['QB']:
      dir = dir + 'data/projections/espn/espn_projections_qb.csv';
      break;
    case POSITIONS['RB']:
      dir = dir + 'data/projections/espn/espn_projections_rb.csv';
      break;
    case POSITIONS['WR']:
      dir = dir + 'data/projections/espn/espn_projections_wr.csv';
      break;
    case POSITIONS['TE']:
      dir = dir + 'data/projections/espn/espn_projections_te.csv';
      break;
    case POSITIONS['K']:
      dir = dir + 'data/projections/espn/espn_projections_k.csv';
      break;
    case POSITIONS['DEF']:
      dir = dir + 'data/projections/espn/espn_projections_def.csv';
      break;
    default:
      dir = dir + 'data/projections/espn/espn_projections_qb.csv';
      break;
  }
  fs.writeFile(dir, csv, function(err){
    if(err){
      console.log(err);
    }
    console.log('saved!');
  });
}

export async function get_espn_projections() {
  let csv = '';
  let data;
  let table;

  // get QB data
  for(var i = 0; i < 2; i++) {
    data = await getHtml(ESPN_URL, 'QB', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, POSITIONS['QB']);
  csv = '';
  // get RB data

  for(var i = 0; i < 4; i++) {
    data = await getHtml(ESPN_URL, 'RB', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, POSITIONS['RB']);
  csv = '';

  // get WR data
  for(var i = 0; i < 5; i++) {
    data = await getHtml(ESPN_URL, 'WR', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, POSITIONS['WR']);
  csv = '';

  // get TE data
  for(var i = 0; i < 3; i++) {
    data = await getHtml(ESPN_URL, 'TE', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, POSITIONS['TE']);
  csv = '';

  // get K data
  for(var i = 0; i < 2; i++) {
    data = await getHtml(ESPN_URL, 'K', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, POSITIONS['K']);
  csv = '';

  // get DEF data
  for(var i = 0; i < 1; i++) {
    data = await getHtml(ESPN_URL, 'DEF', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, POSITIONS['DEF']);
  csv = '';
}
