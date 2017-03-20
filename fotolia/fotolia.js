var config = require('./fotoliaConfig');
var casperOptions = require('../casperConfig');

module.exports = {

  getFotoliaBalance: function (casper, response) {

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
        this.fillSelectors(config.login.form, {
            'input#login' :    'angelonz',
            'input#password' :    'lonewolf'
        }, false);
        this.click(config.login.submit);
        this.echo('form submitted!');
        
    });

    casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.querySelectorAll('div.row-member-summary').length > 0;
        });
    }, function then() {
        
        this.echo(this.fetchText(config.balance));
        
    });


    casper.run(function () {
        response.statusCode = 200;
        var body = JSON.stringify({
            balance: this.fetchText(config.balance)
        })

        response.write(body);
        response.close();
        //casper.done();
    });
  }

};

