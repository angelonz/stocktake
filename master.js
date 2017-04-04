var Pool = require('phantomjs-pool').Pool;

function jobCallback(job, worker, index) {

    /** 
    if (index < 10) { // we just use the index as our data
        job(index, function(err) {
            console.log('DONE: ' + index);
        });
    } else { // no more jobs
        job(null);
    }
    */

    job(index, function(err) {
        console.log('DONE: ' + index);
    });

    job(null);

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