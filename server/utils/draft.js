import csvtojson from 'csvtojson'
var path = require('path');
let qb = {};
let rb = {};
let wr = {};
let te = {};
let k = {};
let def = {};

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
 * 	k:
 * 	def:
 * 	bench: {
 *  	qb:
 *  	rb:
 *  	wr:
 *  }
 * }
 * @param {[String]} draftedPlayers string of drafted players that should not be included in the search for the next best player
 * @return {String}       the name of the player that should be drafted next
 */
export async function getNextPrediction(teamObj, draftedPlayers) {
  // we want to prioritize our starting players first and put less priority on kickers, tight ends, and defenses
  let highestValue;
  if(teamObj.qb < 2 || teamObj.rb < 2 || teamObj.wr < 2) {
    console.log("LOOKING FOR A QB");
    // draft based on highest value over replacement between qbs, rb, and wr
    let qbValue = await getHighestValue('qb', draftedPlayers);
    let rbValue = await getHighestValue('rb', draftedPlayers);
    let wrValue = await getHighestValue('wr', draftedPlayers);

    console.log(rbValue);
    // we have to prevent from over drafting a position. If we  have filled up our slots then we ensure that we do not pick another player of the same position
    if(teamObj.qb == 2) {
      qbValue.value = 0;
    }
    if(teamObj.rb == 2) {
      rbValue.value = 0;
    }
    if(teamObj.wr == 2) {
      wrValue.value = 0;
    }

    if(qbValue.value >= rbValue.value && qbValue.value >= wrValue.value) {
      highestValue = qbValue;
    } else if (rbValue.value >= qbValue.value && rbValue.value >= wrValue.value){
      highestValue = rbValue;
    } else if (wrValue.value >= rbValue.value && wrValue.value >= qbValue.value) {
      highestValue = rbValue;
    }
    // get the highest valued qb
  } else if(teamObj.te < 1) {
    teValue = getHighestValue('te', draftedPlayers);
    highestValue = teValue;
  } else if(teamObj.k < 1 || teamObj.def < 1) {
    kValue = getHighestValue('k', draftedPlayers);
    defValue = getHighestValue('def', draftedPlayers);
    // protect against over drafting
    if(teamObj.k == 1) {
      kValue.value = 0;
    }
    if(teamObj.def == 1) {
      defValue.value = 0;
    }
    if(defValue.value >= kValue.value) {
      highestValue = defValue;
    } else if(kValue.value >= defValue.value) {
      highestValue = kValue;
    }

  } else {
    // now just draft our bench players
  }

  if(highestValue) {
    return highestValue.name;
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
    value: 0
  };
  // search through all qbs sorted by value
  for(let index in obj) {
    // only consider this player if they are not already drafted
    if(!draftedPlayers.includes(obj[index].Player)) {
      if (max < parseFloat(obj[index].Value)) {
        max = parseFloat(obj[index].Value);
        player.name = obj[index].Player;
        player.value = max;
      }
    }
  }

  return player;
};
