var express = require('express');
var router = express.Router();

import { getTable, get_nfl_projections} from '../server/utils/nflProjections';
import { get_cbs_projections} from '../server/utils/cbsProjections';
import { get_espn_projections} from '../server/utils/espnProjections';
import { getAverageProjections } from '../server/shell';

/* GET home page. */
router.get('/', async function(req, res, next) {
  await get_nfl_projections();
  await get_espn_projections();
  await get_cbs_projections();

  res.send('hi');
});

module.exports = router;
