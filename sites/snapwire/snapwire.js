var config = require('./config');

module.exports = {
    getBalance: function (casper, done) {

        casper.on('resource.requested', function(requestData, request) {

            // List of URLs to skip. Entering part of a hostname or path is OK.
            var blackList = config.blacklist;
            var blackListLength = blackList.length;
            // If a match is found, abort the request.
            for (var i = 0; i < blackListLength; i++) {
                if (requestData.url.indexOf(blackList[i]) > -1) {
                    casper.log('Skipped: ' + requestData.url, 'info');
                    request.abort();
                }
            }
        });

        casper.start(config.login.url, function () {

            casper.page.customHeaders = {
                'Accept-Language': 'en-US,en;q=0.8'
            };

            if (this.exists(config.login.form)) {
                this.echo('*** landing page loaded ***');                 
            }
        });

        casper.then(function () {
            
            this.echo('filling form...');

            var options = {};
            options[config.login.username] = 'angelonz';
            options[config.login.password] = 'l0n3w0lf';
            
            this.fillSelectors(config.login.form, options, true);
            this.echo('form submitted!');
                            
        });
                
        casper.waitFor(function check() {            
            return this.exists(config.balance);            
        }, function then() {
            this.echo(this.fetchText(config.balance));
        });
        
        casper.run(function () {    
            var body = {
                balance: this.fetchText(config.balance)
            };
            //casper.done();
            done(null, body);
        });

    }
}





