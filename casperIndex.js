phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var fs = require('fs');
var clipperz = 'https://clipperz.is/app/';
var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug',
  viewportSize: {width: 1280, height: 800}
});

casper.start(clipperz, function () {
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

casper.then(function () {
    this.echo('waiting til visible...');
    this.waitUntilVisible('li[data-tag="photography"]', null, null, 30000);
});

var websites;

casper.thenClick('li[data-tag="photography"]',function () {
    this.echo('clicking photography...');

    matches = this.evaluate(function() {
        var links = document.querySelectorAll('div.cardListInnerWrapper > ul > li');
        return Array.prototype.map.call(links, function (e) {
            return e.getAttribute('data-label')
        });
        
    });

});


casper.then(function () {
    this.echo('processing links...');

    casper.each(websites, function (self, link) {
        self.click('li[data-label="' + link + '"]');
    });
}).then(function () {
    this.waitUntilVisible('div.cardFields', function () {
        this.capture('load.png');
    }
    , null, 30000);
});


casper.run(function () {
    casper.done();
});