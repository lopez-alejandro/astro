var express = require('express');
var router = express.Router();

import { getTable, get_nfl_projections} from '../server/utils/nflProjections';
import { get_cbs_projections} from '../server/utils/cbsProjections';
import { get_espn_projections} from '../server/utils/espnProjections';

/* GET home page. */
router.get('/', function(req, res, next) {
  get_espn_projections();
  get_cbs_projections();
  res.send(get_nfl_projections());
});

module.exports = router;
