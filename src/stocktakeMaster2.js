const Pool = require('phantomjs-pool').Pool;
const _ = require('lodash');
const siteRegistrationUtil = require('./clientSiteRegistrationUtil');
const emitter = require('./util/eventManager').getEmitter();

/**
 * The main master file that orchestrates the jobs
 * 
 * @param {*} site  the stock photography website we're after
 * @param {*} email uniquely identifies the user
 */
function Stocktake(site, email) {

    this.email = email;
    this.site = site;
    this.result = {};

    var that = this;

    const jobCallback = (job, worker, index) => {
                
        if (index < this.sites.length) { 
                        
            let siteName = this.sites[index];
            let jobData = {
                siteName: siteName,
                email: this.email
            } 

            job(jobData, (err, data) => {
                
                let siteNameToProcess = jobData.siteName;
                
                if (_.isNull(err) && data) {
                    console.log('DONE: ' + siteNameToProcess + ':' + data.balance);

                    //let value = data.balance;
                    let balance = data.balance;

                    // we could not fetch the balance
                    if (_.isNil(balance) || (balance.length === 0)) {
                        balance = '-';
                    } 
                    
                    that.result[siteNameToProcess] = balance;
                    // we can fire this here since we're only dealing with one site at a time
                    // TODO - do we need to make this unique per user?
                    emitter.emit(`${this.email}:${this.site}:complete`);
                } 
                
            });
                    
        } else { // no more jobs
            job(null);
            
        }

    };

    this.sites = [site];

    this.pool = new Pool({
        numWorkers : this.sites.length,        
        jobCallback : jobCallback,
        workerFile : __dirname + '/stocktakeWorker.js', // location of our worker file (as an absolute path)
        phantomjsBinary: __dirname + '/../bin/' + process.env.BIN + '/phantomjs',
        spawnWorkerDelay: 100,
        verbose: true,
        workerTimeout: 30000
    });

}    

Stocktake.prototype.allJobsFinished = function() {
    // checks if all sites have been processed by comparing the lengths of the sites array with the 
    // result object
    console.log('result', this.result);
    return this.sites.length === _.keys(this.result).length;
};

Stocktake.prototype.getPool = function() {
    return this.pool;
};

Stocktake.prototype.getBalances = function() {
    return new Promise((resolve, reject) => {
        
        emitter.on(`${this.email}:${this.site}:complete`, () => {
            console.log(`*** ${this.site} completed *****`);
            if (this.allJobsFinished()) {
                console.log('*** promise resolved *****');
                resolve(this.result);
            } else {
                reject({
                    error: 'error fetching balance'
                });
            }
        });
        

    }); 
}

module.exports = Stocktake;

