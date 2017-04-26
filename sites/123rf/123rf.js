var config = require('./config');
const _ = require('lodash');

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
          
          if (this.exists(config.login.username)) {
              this.echo('login form loaded');
          }
      });

      casper.then(function () {
          
          this.echo('filling form...');
          
          var options = {};
          options[config.login.username] = 'angelonz';
          options[config.login.password] = 'L0n3w0lf';

          this.fillSelectors(config.login.form, options, true);
          this.echo('form submitted!');
      });

      casper.waitFor(function check() {
          return this.exists(config.waitForElement);
          
      }, function then() {
          casper.thenOpen(config.landingPage, function () {
              this.waitWhileVisible('div.welcome_text', function () {
                this.echo('waiting for loading sign to disappear...');
              })
          });         
      });

      casper.waitFor(function check() {
          return this.exists(config.balance);
          
      }, function then() {
          this.capture('123afterlogin.png');          
      }, function timeout() {
          // what do we do on a timeout?
      });


      casper.run(function () {
        var body = {
            balance: _.trim(this.fetchText(config.balance))
        };
        //casper.done();
        done(null, body);
      });
  }
}

