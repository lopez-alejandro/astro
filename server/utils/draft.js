import csvtojson from 'csvtojson'
var path = require('path');

// variables used to store our data from csv files
let qb = {};
let rb = {};
let wr = {};
let te = {};
let k = {};
let def = {};

// weights used for calculated adjusted value of player
// for our bench we do not care so much about minimizing risk and we care more
// about getting sleepers.
const weights = {
  points: 1,
  risk: -10,
  adpDif: -5,
  riskBench: -5,
  adpDifBench: -10
}


/**
 * Helper function that reads the csv files and puts them into js objects
 * @return {[type]} [description]
 */
export async function readData() {

  let qbPromise = new Promise( resolve => {
    let index = 0;
    csvtojson({noHeader:true}).fromFile(path.join(__dirname, '../../data/projections/averages/qb.csv')).on('json', (jsonObj) => {
      qb[index] = jsonObj;
      index++;
    }).on('done', (error) => {
      resolve();
    });
  });

  let rbPromise = new Promise( resolve => {
    let index = 0;
    csvtojson({noHeader:true}).fromFile(path.join(__dirname, '../../data/projections/averages/rb.csv')).on('json', (jsonObj) => {
      rb[index] = jsonObj;
      index++;
    }).on('done', (error) => {
      resolve();
    });
  });


  let wrPromise = new Promise( resolve => {
    let index = 0;
    csvtojson({noHeader:true}).fromFile(path.join(__dirname, '../../data/projections/averages/wr.csv')).on('json', (jsonObj) => {
      wr[index] = jsonObj;
      index++;
    }).on('done', (error) => {
      resolve();
    });
  });


  let tePromise = new Promise( resolve => {
    let index = 0;
    csvtojson({noHeader:true}).fromFile(path.join(__dirname, '../../data/projections/averages/te.csv')).on('json', (jsonObj) => {
      te[index] = jsonObj;
      index++;
    }).on('done', (error) => {
      resolve();
    });
  });


  let kPromise = new Promise( resolve => {
    let index = 0;
    csvtojson({noHeader:true}).fromFile(path.join(__dirname, '../../data/projections/averages/k.csv')).on('json', (jsonObj) => {
      k[index] = jsonObj;
      index++;
    }).on('done', (error) => {
      resolve();
    });
  });


  let defPromise = new Promise(resolve => {
    let index = 0;
    csvtojson({noHeader:true}).fromFile(path.join(__dirname, '../../data/projections/averages/def.csv')).on('json', (jsonObj) => {
      def[index] = jsonObj;
      index++;
    }).on('done', (error) => {
      resolve();
    });

  });
  // wait until all promises are resolved before exiting the function
  await Promise.all([
    qbPromise,
    rbPromise,
    wrPromise,
    tePromise,
    kPromise,
    defPromise
  ]);

};

/**
 * returns the name of the player that you should pick next based on the teamObj
 * @param  {[Obj]} teamObj a javascript object that represents you team. should be in the format of
 * {
 * 	qb: 1 // ammount of qbs you have
 * 	rb: 0 // amount of rbs you have
 * 	wr:
 * 	te:
 * 	flex:
 * 	k:
 * 	def:
 * 	bench: {
 *  	qb:
 *  	rb:
 *  	wr:
 *  	te:
 *  	k:
 *  	def:
 *  }
 * }
 * @param {[String]} draftedPlayers string of drafted players that should not be included in the search for the next best player
 * @return {String}       the name of the player that should be drafted next
 */
export async function getNextPrediction(teamObj, draftedPlayers) {
  // we want to prioritize our starting players first and put less priority on kickers, tight ends, and defenses
  let highestValue;
  console.log(teamObj.bench);
  if(teamObj.qb < 2 || teamObj.rb < 2 || teamObj.wr < 2) {
    // draft based on highest value over replacement between qbs, rb, and wr
    let qbValue = await getHighestValue('qb', draftedPlayers);
    let rbValue = await getHighestValue('rb', draftedPlayers);
    let wrValue = await getHighestValue('wr', draftedPlayers);

    // apply the weights based on risk (std dev) and adp difference (adp dif)
    qbValue.value = (qbValue.value * weights.points) +
                    (qbValue.risk * weights.risk) +
                    (qbValue.adpDif * weights.adpDif);
    rbValue.value = (rbValue.value * weights.points) +
                    (rbValue.risk * weights.risk) +
                    (rbValue.adpDif * weights.adpDif);

    wrValue.value = (wrValue.value * weights.points) +
                    (wrValue.risk * weights.risk) +
                    (wrValue.adpDif * weights.adpDif);

    // we have to prevent from over drafting a position. If we  have filled up our slots then we ensure that we do not pick another player of the same position
    if(teamObj.qb == 2) {
      qbValue.value = -100000;
    }
    if(teamObj.rb == 2) {
      rbValue.value = -100000;
    }
    if(teamObj.wr == 2) {
      wrValue.value = -100000;
    }

    if(qbValue.value >= rbValue.value && qbValue.value >= wrValue.value) {
      highestValue = qbValue;
    } else if (rbValue.value >= qbValue.value && rbValue.value >= wrValue.value){
      highestValue = rbValue;
    } else if (wrValue.value >= rbValue.value && wrValue.value >= qbValue.value) {
      highestValue = wrValue;
    }

    // get the highest valued qb
  } else if(teamObj.te < 1) {
    teValue = await getHighestValue('te', draftedPlayers);
    highestValue = teValue;
  } else if(teamObj.flex < 1) {
    // for flex we consider rb, wr, and te
    let rbValue = await getHighestValue('rb', draftedPlayers);
    let wrValue = await getHighestValue('wr', draftedPlayers);
    let teValue = await getHighestValue('te', draftedPlayers);

    // apply the weights based on risk (std dev) and adp difference (adp dif)
    teValue.value = (teValue.value * weights.points) +
                    (teValue.risk * weights.risk) +
                    (teValue.adpDif * weights.adpDif);

    rbValue.value = (rbValue.value * weights.points) +
                    (rbValue.risk * weights.risk) +
                    (rbValue.adpDif * weights.adpDif);

    wrValue.value = (wrValue.value * weights.points) +
                    (wrValue.risk * weights.risk) +
                    (wrValue.adpDif * weights.adpDif);
    //
    if (wrValue.value >= rbValue.value && wrValue.value >= teValue.value) {
      highestValue = wrValue;
    } else if (rbValue.value >= teValue.value && rbValue.value >= wrValue.value){
      highestValue = rbValue;
    } else if(teValue.value >= rbValue.value && teValue.value >= wrValue.value) {
      highestValue = teValue;
    }
  } else if(teamObj.k < 1 || teamObj.def < 1) {
    let kValue = await getHighestValue('k', draftedPlayers);
    let defValue = await getHighestValue('def', draftedPlayers);

    kValue.value = (kValue.value * weights.points) +
                    (kValue.risk * weights.risk) +
                    (kValue.adpDif * weights.adpDif);
    ///
    defValue.value = (defValue.value * weights.points) +
                    (defValue.risk * weights.risk) +
                    (defValue.adpDif * weights.adpDif);

    // protect against over drafting
    if(teamObj.k == 1) {
      kValue.value = -100000;
    }
    if(teamObj.def == 1) {
      defValue.value = -100000;
    }
    if(defValue.value >= kValue.value) {
      highestValue = defValue;
    } else if(kValue.value >= defValue.value) {
      highestValue = kValue;
    }
  } else {
    // now just draft our bench players=
    if(teamObj.bench.qb < 1 || teamObj.bench.rb < 2 || teamObj.bench.wr < 2 || teamObj.bench.te < 1 ) {
      // if all other positions are filled then we can go after extra defenses
      // draft based on highest value over replacement between qbs, rb, and wr
      let qbValue = await getHighestValue('qb', draftedPlayers);
      let rbValue = await getHighestValue('rb', draftedPlayers);
      let wrValue = await getHighestValue('wr', draftedPlayers);
      let teValue = await getHighestValue('te', draftedPlayers);

      // apply the weights based on risk (std dev) and adp difference (adp dif)
      qbValue.value = (qbValue.value * weights.points) +
                      (qbValue.risk * weights.riskBench) +
                      (qbValue.adpDif * weights.adpDifBench);

      rbValue.value = (rbValue.value * weights.points) +
                      (rbValue.risk * weights.riskBench) +
                      (rbValue.adpDif * weights.adpDifBench);

      wrValue.value = (wrValue.value * weights.points) +
                      (wrValue.risk * weights.riskBench) +
                      (wrValue.adpDif * weights.adpDifBench);
      ////
      teValue.value = (teValue.value * weights.points) +
                      (teValue.risk * weights.riskBench) +
                      (teValue.adpDif * weights.adpDifBench);
      ///
      // we have to prevent from over drafting a position. If we  have filled up our slots then we ensure that we do not pick another player of the same position
      if(teamObj.bench.qb == 1) {
        qbValue.value = -100000;
      }
      if(teamObj.bench.rb == 2) {
        rbValue.value = -100000;
      }
      if(teamObj.bench.wr == 2) {
        wrValue.value = -100000;
      }
      if(teamObj.bench.te == 1) {
        teValue.value = -100000;
      }

      if(qbValue.value >= rbValue.value && qbValue.value >= wrValue.value && qbValue.value >= teValue.value) {
        highestValue = qbValue;
      } else if (wrValue.value >= rbValue.value && wrValue.value >= qbValue.value && wrValue.value >= teValue.value) {
        highestValue = wrValue;
      } else if (rbValue.value >= qbValue.value && rbValue.value >= wrValue.value && rbValue.value >= teValue.value){
        highestValue = rbValue;
      } else if(teValue.value >= rbValue.value && teValue.value >= wrValue.value && teValue.value >= qbValue.value) {
        highestValue = teValue;
      }
    } else if (teamObj.bench.def < 1){
      let defValue = await getHighestValue('def', draftedPlayers);
      highestValue = defValue;
    }
  }

  if(highestValue) {
    return highestValue;
  } else {
    return null;
  }
};

// helper function that will get the highest valued player that has not been drafted for a certain position
export async function getHighestValue(position, draftedPlayers) {
  let obj = {};
  switch(position) {
    case 'qb':
      obj = qb;
      break;
    case 'rb':
      obj = rb;
      break;
    case 'wr':
      obj = wr;
      break;
    case 'te':
      obj = te;
      break;
    case 'k':
      obj = k;
      break;
    case 'def':
      obj = def;
      break;
    default:
      obj = undefined;
  }

  let max = 0;
  let player = {
    name: '',
    value: 0,
    risk: 0,
    adpDif: 0,
    position: position
  };
  // search through all qbs sorted by value
  for(let index in obj) {
    // only consider this player if they are not already drafted
    if(!draftedPlayers.includes(obj[index].Player)) {
      if (max < parseFloat(obj[index].Value)) {
        max = parseFloat(obj[index].Value);
        player.name = obj[index].Player;
        player.value = max;
        player.risk = parseFloat(obj[index]['STD DEV']);
        player.adpDif = parseFloat(obj[index]['ADP DIF']);
      }
    }
  }
  return player;
};
