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
        if (this.exists(config.login.link)) {
              this.echo('landing page loaded');
              this.capture('alamylanding.png');  
              this.click(config.login.link);
        }
    });

    casper.waitFor(function check() {
          return this.exists('input#btnLogin');
          
      }, function then() {
          this.capture('alamylogin2.png');        
      }, function timeout() {
          this.capture('timeout.png');
      });

    casper.then(function () {
        
        this.echo('filling form...');

        var options = {};
        options[config.login.username] = 'a_m_angeles@yahoo.com';
        options[config.login.password] = '22bw00dr1dg3';
        
        this.fillSelectors(config.login.form, options, true);

        this.echo('form submitted!');
        
    });

    casper.waitFor(function check() {
          return this.exists(config.waitForElement);
          
      }, function then() {
          casper.thenOpen(config.landingPage, function () {
              this.capture('alamy.png');
          });         
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

};

