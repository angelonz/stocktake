phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var fs = require('fs');
var clipperz = 'https://clipperz.is/app/';
var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug'
});

casper.start(clipperz, function () {
    console.log(fs.workingDirectory);
    this.waitForSelector('div#loginPage form');
});

casper.then(function () {
    this.echo('filling form...');
    this.fillSelectors('div#loginPage form', {
        'input[name="name"]':    'angelonz',
        'input[name="passphrase"]':    'st0ckt@k3'
    }, true);
    this.echo('form submitted!');
});

var injectJQuery = function () {
    this.captureSelector('capture.png', 'body');
    this.echo(this.getElementsInfo('.tagList'));

    var count = this.evaluate(function () {
        
        return this.getElementsInfo('.tagList');
    });

    console.log('matches', count);  
    
};

casper.then(function () {
    this.echo('waiting til visible...');
    this.waitUntilVisible('cardListColumn', injectJQuery, null, 600000);
});

casper.run(function () {
    casper.done();
});