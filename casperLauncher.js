var exec = require('child_process'),
    path = require('path');

var phantomjs = path.resolve(__dirname, 'bin/mac');
//var casperjs = path.resolve(__dirname, 'bins', 'casperjs', 'bin');

process.env.PATH = process.env.PATH + ':' + phantomjs;

// Now launch a casperjs script and get result.
var p = exec.spawn('phantomjs', ['phantomServerLauncher.js']);
p.stdout.on('data', function(data) {
    console.log(data.toString());
});


