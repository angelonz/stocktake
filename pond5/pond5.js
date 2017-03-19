var config = require('./pond5Config');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug',
  viewportSize: {width: 1280, height: 800},
  waitTimeout: 10000,
  
  pageSettings: {
    loadImages: false
  }
  
  
});


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
    this.echo('pond5!!!');
    this.capture('pond5.png');
    if (this.exists(config.login.loginLink)) {
        this.echo('landing page');
        this.capture('pond5.png');
    }
    
});

casper.run(function () {
    casper.done();
});