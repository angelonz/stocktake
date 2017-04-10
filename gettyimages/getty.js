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
                if (this.exists(config.login.form)) {
                    this.echo('*** landing page loaded ***'); 
                    
                }
            });

            casper.then(function () {
                
                this.echo('filling form...');
                //__util__.setFieldValue()
                this.fillSelectors(config.login.form, {
                    'input#new_session_username' :    'a_m_angeles@yahoo.com',
                    'input#new_session_password' :    'l0n3w0lf'
                }, false);
                this.click(config.login.submit);
                this.echo('form submitted!');
                                
            });

            casper.open('https://accountmanagement.gettyimages.com/Reports/Statement', function () {
                this.capture('getty.png');
            });

            /*
            casper.waitFor(function check() {
                
                return this.exists(config.balance);
                
            }, function then() {          
                //this.click(config.link1);
            });
            */

            casper.run(function () {    
                var body = {
                    balance: this.fetchText(config.balance)
                };
                //casper.done();
                done(null, body);
            });

    }
}





