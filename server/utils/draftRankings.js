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

export const FP_URL = 'http://www.fantasypros.com/nfl/rankings/';

export function getCsv(table){

}
