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
        if (this.exists(config.login.modal)) {
            this.echo('welcome modal shown');
            this.click(config.login.modal);
        }
    });


    casper.then(function () {
        
        this.echo('filling form...');

        var options = {};
        options[config.login.username] = 'angelonz';
        options[config.login.password] = 'lonewolf';
        
        this.fillSelectors(config.login.form, options, false);

        this.click(config.login.submit);
        this.echo('form submitted!');
        
    });

    casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.querySelectorAll('div.row-member-summary').length > 0;
        });
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

};

