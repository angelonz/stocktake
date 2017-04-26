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
        this.echo('login page loaded');
    });

    casper.waitFor(function check() {
          return this.exists(config.login.submit);
          
      }, function then() {
          //this.capture('./screens/login.png');        
      }, function timeout() {
          this.capture('./screens/timeout.png');
      });

    casper.then(function () {
        
        this.echo('filling form...');

        var options = {};
        options[config.login.username] = 'a_m_angeles@yahoo.com';
        options[config.login.password] = '22bw00dr1dg3';
        
        this.fillSelectors(config.login.form, options, false);
        this.click(config.login.submit);
        
        this.echo('form submitted!');
        
    });

    casper.waitForUrl(config.landingPage, function () {
        this.echo('url changed to ' + config.landingPage);
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

};

