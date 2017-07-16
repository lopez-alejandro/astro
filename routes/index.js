var express = require('express');
var router = express.Router();

import { getTable, get_nfl_projections} from '../server/utils/nflProjections';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(get_nfl_projections());
});

module.exports = router;
