/**
 * Downloads player projections from the NFL website and converts them
 * into a CSV file to be consumed later for our calculations
 */

import cheerio from 'cheerio';
import tableToCsv from 'node-table-to-csv';
import fetch from 'node-fetch';
import fs from 'fs';
const path = require('path');

export const POSITIONS = {
  QB: 1,
  RB: 2,
  WR: 3,
  TE: 4,
  K: 5,
  DEF: 6,
};

export const SOURCES = {
  NFL: 0,
  CBS: 1,
  ESPN: 2,
};

// url for the NFL QB position

export const NFL_URL = `http://fantasy.nfl.com/research/projections?sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats`;

export const NFL_QB_URL =  `http://fantasy.nfl.com/research/projections?position=1&sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats`;

export const NFL_QB_URL_2 = 'http://fantasy.nfl.com/research/projections?offset=26&position=1&sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats';

export const NFL_QB_URL_3 = 'http://fantasy.nfl.com/research/projections?offset=51&position=1&sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats';

export const NFL_QB_URL_4 = 'http://fantasy.nfl.com/research/projections?offset=76&position=1&sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats';

// url for the NFL RB position
export const NFL_RB_URL = `http://fantasy.nfl.com/research/projections?position=2&sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats`;

export const NFL_RB_URL_2 = 'http://fantasy.nfl.com/research/projections?offset=26&position=2&sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats';

export const NFL_RB_URL_3 = 'http://fantasy.nfl.com/research/projections?offset=51&position=2&sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats';

export const NFL_RB_URL_4 = 'http://fantasy.nfl.com/research/projections?offset=76&position=2&sort=projectedPts&statCategory=projectedStats&statSeason=2017&statType=seasonProjectedStats';



// returns the html of the given url
export async function getHtml(url, position, page) {
  let pageOffset = page * 25 + 1;
  // modify the url so it displays the right page and position
  url += `&offset=${pageOffset}&position=${POSITIONS[position]}`;

  let response = await fetch(url);
  let data = await response.text();
  return data;

}

// parses the table from the nfl website using cheerio
export async function getNflTable(data) {
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
    table = await getNflTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['QB']);
  csv = '';
  // get RB data

  for(var i = 0; i < 4; i++) {
    data = await getHtml(NFL_URL, 'RB', i);
    table = await getNflTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['RB']);
  csv = '';

  // get WR data
  for(var i = 0; i < 4; i++) {
    data = await getHtml(NFL_URL, 'WR', i);
    table = await getNflTable(data);
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
    table = await getNflTable(data);
    let removeHeaders = false;
    if(i > 0) {
      removeHeaders = true;
    }
    csv += getCsv(table, removeHeaders);
  }

  storeAsCsv(csv, SOURCES['NFL'], POSITIONS['TE']);
  csv = '';
  
}
