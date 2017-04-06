const Pool = require('phantomjs-pool').Pool;
const _ = require('lodash');
const siteRegistrationUtil = require('./clientSiteRegistrationUtil');

// FIX this
const os = 'windows';

// this object will contain all the balances
let sites,
    result = {};

const allJobsFinished = () => {
    // checks if all sites have been processed by comparing the lengths of the sites array with the 
    // result object
    return this.sites.length === _.keys(this.result).length;
};

const jobCallback = (job, worker, index) => {

    this.sites = siteRegistrationUtil.getRegisteredSites();
    console.log('sites', this.sites);

    if (index < this.sites.length) { 

        // TODO: figure out a way to base this on the sites that a client has registered for
        
        let siteName = this.sites[index];

        job(siteName, (err, data) => {
            
            if (data && _.isNull(err)) {
                console.log('DONE: ' + siteName + ':' + data.balance);
                result[siteName] = data.balance;
            } else {
                // what do we do?
            }
            
        });
                
    } else { // no more jobs
        job(null);
    }

}

const pool = new Pool({
    numWorkers : 3,
    jobCallback : jobCallback,
    workerFile : __dirname + '/stocktakeWorker.js', // location of our worker file (as an absolute path)
    phantomjsBinary: __dirname + '../../bin/' + os + '/phantomjs',
    spawnWorkerDelay: 100,
    verbose: true,
    workerTimeout: 180000
});

module.exports = {
    pool: pool,
    getBalances: () => {
        return new Promise((resolve, reject) => {
            console.log('*** in promise... *****');
            if (allJobsFinished()) {
                resolve(result);
            }

        }); 
    }
}

