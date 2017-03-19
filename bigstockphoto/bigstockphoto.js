var config = require('./bigstockConfig');
var casperOptions = require('../casperConfig');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create(casperOptions);

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
    //__util__.setFieldValue()
    this.fillSelectors(config.login.form, {
        'input#uname' :    'angelonz',
        'input#passwd' :    'lonewolf'
    }, true);
    this.echo('form submitted!');
    
});

casper.waitFor(function check() {
    return this.exists(config.balance);
    /**
    return this.evaluate(function() {
        return document.querySelectorAll(config.balance).length > 0;
    });
*/
}, function then() {
    this.echo(this.fetchText(config.balance));
    
});


casper.run(function () {
    casper.done();
});