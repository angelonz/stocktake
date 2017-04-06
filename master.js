var Pool = require('phantomjs-pool').Pool;
var os = process.argv.slice(2)[0];

function jobCallback(job, worker, index) {

    if (index < 3) { // we just use the index as our data

        var sites = {
            '0': 'fotolia',
            '1': 'bigstockphoto',
            '2': 'dreamstime'
        }

        job(sites[index], function(err, data) {
            console.log('DONE: ' + sites[index] + ':' + data.balance);
        });
    } else { // no more jobs
        job(null);
    }

}

var pool = new Pool({
    numWorkers : 3,
    jobCallback : jobCallback,
    workerFile : __dirname + '/stocktakeWorker.js', // location of our worker file (as an absolute path)
    phantomjsBinary: __dirname + '/bin/' + os + '/phantomjs',
    spawnWorkerDelay: 100,
    verbose: true
});
pool.start();