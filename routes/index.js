var express = require('express');
var router = express.Router();

import { getTable, get_nfl_projections} from '../server/utils/nflProjections';
import { get_cbs_projections} from '../server/utils/cbsProjections';
import { get_espn_projections} from '../server/utils/espnProjections';
import { get_fp_projections } from '../server/utils/fpProjections'
import { getAverageProjections } from '../server/shell';
import { readData } from '../server/utils/draft';
import { getNextPrediction } from '../server/utils/draft';
import initApp from '../server/shell';
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', async function(req, res, next) {



  res.render('index');
});

router.get('/data', async function(req, res, next) {
  await get_nfl_projections();
  await get_espn_projections();
  await get_cbs_projections();
  await get_fp_projections();

  exec('python server/utils/sanitizeProjections.py', function(error, stdout, stderr) {
    if(error) console.log(error);

    exec('python server/averageProjections.py', function(error) {
      if(error) console.log(error);

      exec('python server/utils/valueOverReplacement.py', function(error) {
        if(error) console.log(error);

        exec('python server/utils/rankings.py', function(error) {

          res.send('done');
        });
      });
    })
  });

});

router.get('/prepareDraft', async function(req, res, next) {
  await readData();
  res.send('loaded data');
});

router.post('/nextDraft', async function(req, res, next) {
  /*
  let teamObj = {
    qb: 2,
    rb: 2,
    wr: 2,
    te: 1,
    flex: 1,
    k: 1,
    def: 1,
    bench: {
      qb: 1,
      rb: 1,
      wr: 1,
      te: 1,
      def: 0
    }
  };
  let draftedPlayers = ['Aaron Rodgers', 'David Johnson', 'Le\'Veon Bell'];
  */
  //let draftedPlayers = [];

  let teamObj = req.body.team ? req.body.team : {};
  let draftedPlayers = req.body.draftedPlayers ? req.body.draftedPlayers : [];
  console.log(teamObj);
  const nextPlayer = await getNextPrediction(teamObj, draftedPlayers);
  res.send(nextPlayer);
});

module.exports = router;
