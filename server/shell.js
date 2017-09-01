import PythonShell from 'python-shell';
var path = require('path');

export async function getAverageProjections() {
  var dir = path.join(__dirname, 'averageProjections.py');
  console.log(dir);

  let options = {
    mode: 'text',
    pythonPath: '/usr/local/bin/python2.7',
    pythonOptions: ['-u'],
    scriptPath: __dirname,
    args: ['hello']
  };

  PythonShell.run('averageProjections.py',options, function(err){
      if(err) throw err;

      console.log('finished');
  });
  /*
  pyshell.run('averageProjections.py', options,function(err) {
    if(err) {
      console.log(err);
      throw err;
    }
    console.log('finished');
  });
  */
}

export default async function initData() {
  var dir = path.join(__dirname, 'averageProjections.py');
  console.log(dir);

  let options = {
    mode: 'text',
    pythonPath: '/usr/local/bin/python2.7',
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, 'utils'),
    args: []
  };

  PythonShell.run('sanitizeProjections.py', options, function(err) {
    if(err) console.log(err);

    let optionsA = {
      mode: 'text',
      pythonPath: '/usr/local/bin/python2.7',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: []
    };
    PythonShell.run('averageProjections.py',optionsA, function(err){
        if(err) console.log(err);

        PythonShell.run('valueOverReplacement.py', options, function(err) {
          if(err) throw err;

          PythonShell.run('rankings.py',options, function(err) {
            if(err) console.log(err);

          });
        });
    });
  });


}
