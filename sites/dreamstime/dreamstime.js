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
                if (this.exists(config.login.loginToggle)) {
                    this.echo('*** landing page loaded ***');
                    this.click(config.login.loginToggle);
                    
                }
            });

            casper.then(function () {
                
                this.echo('filling form...');
                //__util__.setFieldValue()
                this.fillSelectors(config.login.form, {
                    'input#inp_user' :    'angelonz',
                    'input#inp_pass' :    'lonewolf'
                }, true);
                this.echo('form submitted!');
                                
            });

            casper.waitFor(function check() {
                return this.exists(config.balance);
                
            }, function then() {
                //this.echo(this.fetchText(config.balance));
                
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





