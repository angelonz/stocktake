var config = require('./fotoliaConfig');

phantom.casperPath = '../node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug',
  viewportSize: {width: 1280, height: 800}
});

casper.start(conig.url);
casper.then(function () {
    this.echo('filling form...');
    this.fillSelectors(config.form, {
        config.username:    'angelonz',
        config.password:    'lonewolf'
    }, true);
    this.echo('form submitted!');
    
});

casper.then(function() {
	this.capture('load.png');
});
