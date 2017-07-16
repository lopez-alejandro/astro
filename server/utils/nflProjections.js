/**
 * Downloads player projections from the NFL website and converts them
 * into a CSV file to be consumed later for our calculations
 */

import fetch from 'node-fetch';
import fs from 'fs';
import { getTable, getCsv } from './scraperHelper';
const path = require('path');

export const POSITIONS = {
  QB: 1,
  RB: 2,
  WR: 3,
  TE: 4,
  K: 7,
  DEF: 8,
};

export const SOURCES = {
  NFL: 0,
  CBS: 1,
  ESPN: 2,
};

// url for the NFL website
export const NFL_URL = `http://fantasy.nfl.com/research/projections?sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats`;




// returns the html of the given url
export async function getHtml(url, position, page) {
  let pageOffset = page * 25 + 1;
  // modify the url so it displays the right page and position
  url += `&offset=${pageOffset}&position=${POSITIONS[position]}`;

  let response = await fetch(url);
  let data = await response.text();
  return data;

}



// converts the given table to a csv file and saves it on the server
export async function storeAsCsv(csv, source, position) {
  let dir = path.join(__dirname, "../../../", "");
  switch(position) {
    case POSITIONS['QB']:
      dir = dir + 'data/projections/nfl/nfl_projections_qb.csv';
      break;
    case POSITIONS['RB']:
      dir = dir + 'data/projections/nfl/nfl_projections_rb.csv';
      break;
    case POSITIONS['WR']:
      dir = dir + 'data/projections/nfl/nfl_projections_wr.csv';
      break;
    case POSITIONS['TE']:
      dir = dir + 'data/projections/nfl/nfl_projections_te.csv';
      break;
    case POSITIONS['K']:
      dir = dir + 'data/projections/nfl/nfl_projections_k.csv';
      break;
    case POSITIONS['DEF']:
      dir = dir + 'data/projections/nfl/nfl_projections_def.csv';
      break;
    default:
      dir = dir + 'data/projections/nfl/nfl_projections_qb.csv';
      break;
  }
  fs.writeFile(dir, csv, function(err){
    if(err){
      console.log(err);
    }
    console.log('saved!');
  });
}


export async function get_nfl_projections() {
  let csv = '';
  let data;
  let table;

  // get QB data
  for(var i = 0; i < 4; i++) {
    data = await getHtml(NFL_URL, 'QB', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['QB']);
  csv = '';
  // get RB data

  for(var i = 0; i < 6; i++) {
    data = await getHtml(NFL_URL, 'RB', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['RB']);
  csv = '';

  // get WR data
  for(var i = 0; i < 8; i++) {
    data = await getHtml(NFL_URL, 'WR', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['WR']);
  csv = '';

  // get TE data
  for(var i = 0; i < 4; i++) {
    data = await getHtml(NFL_URL, 'TE', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['TE']);
  csv = '';

  // get K data
  for(var i = 0; i < 2; i++) {
    data = await getHtml(NFL_URL, 'K', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['K']);
  csv = '';

  // get DEF data
  for(var i = 0; i < 1; i++) {
    data = await getHtml(NFL_URL, 'DEF', i);
    table = await getTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['DEF']);
  csv = '';

  return true;
}
