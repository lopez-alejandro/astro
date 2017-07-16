import pythonShell from 'python-shell';
var path = require('path');

export function getAverageProjections() {
  var dir = path.join(__dirname, 'averageProjections.py');
  console.log(dir);
  var options = {
    scriptPath: __dirname,
    mode: 'text'
  };

  let pyshell = new pythonShell('averageProjections.py', options);

  pyshell.on('message', function(message) {
    console.log(message);
  });

  pyshell.end(function(err){
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
