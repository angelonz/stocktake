const Pool = require('phantomjs-pool').Pool;
const _ = require('lodash');
const siteRegistrationUtil = require('./clientSiteRegistrationUtil');
const events = require('events');

function Stocktake(site) {

    this.emitter = new events.EventEmitter();
    this.result = {};

    var that = this;

    const jobCallback = (job, worker, index) => {
                
        if (index < this.sites.length) { 

            // TODO: figure out a way to base this on the sites that a client has registered for
            
            let siteName = this.sites[index];

            job(siteName, (err, data) => {
                
                if (data && _.isNull(err)) {
                    console.log('DONE: ' + siteName + ':' + data.balance);
                    that.result[siteName] = data.balance;
                } else {
                    // what do we do?
                }
                
            });
                    
        } else { // no more jobs
            job(null);
            this.emitter.emit('jobsComplete');
        }

    };

    //this.sites = siteRegistrationUtil.getRegisteredSites();
    this.sites = [site];

    this.pool = new Pool({
        numWorkers : this.sites.length,        
        jobCallback : jobCallback,
        workerFile : __dirname + '/stocktakeWorker.js', // location of our worker file (as an absolute path)
        phantomjsBinary: __dirname + '/../bin/' + process.env.BIN + '/phantomjs',
        spawnWorkerDelay: 100,
        verbose: true,
        workerTimeout: 180000
    });

}    

Stocktake.prototype.allJobsFinished = function() {
    // checks if all sites have been processed by comparing the lengths of the sites array with the 
    // result object
    console.log('sites',this.sites);
    console.log('result', this.result);
    return this.sites.length === _.keys(this.result).length;
};

Stocktake.prototype.getPool = function() {
    return this.pool;
};

Stocktake.prototype.getBalances = function() {
    return new Promise((resolve, reject) => {
        
        this.emitter.on('jobsComplete', () => {
            console.log('*** jobs completed *****');
            if (this.allJobsFinished()) {
                console.log('*** promise resolved *****');
                resolve(this.result);
            }   
        });
        

    }); 
}

module.exports = Stocktake;

