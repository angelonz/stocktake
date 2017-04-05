var Pool = require('phantomjs-pool').Pool;

function jobCallback(job, worker, index) {

    if (index < 1) { // we just use the index as our data
        job(index, function(err, data) {
            console.log('DONE: ' + data.balance);
        });
    } else { // no more jobs
        job(null);
    }

}

var pool = new Pool({
    numWorkers : 1,
    jobCallback : jobCallback,
    workerFile : __dirname + '/fotoliaWorker.js', // location of our worker file (as an absolute path)
    phantomjsBinary: __dirname + '/bin/windows/phantomjs',
    spawnWorkerDelay: 100,
    verbose: true
});
pool.start();