var config = require('./fotoliaConfig');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug',
  viewportSize: {width: 1280, height: 800}
});

casper.start(config.login.url);

casper.then(function () {
    this.echo('filling form...');
    this.fillSelectors(config.login.form, {
        'input#login' :    'angelonz',
        'input#password' :    'lonewolf'
    }, true);
    this.echo('form submitted!');
    
});

casper.then(function () {
    this.waitUntilVisible('#row-member-section', function () {
        var credits = this.evaluate(function () {
            return __util__.findOne(config.balance).innerText;
        });

        this.echo(credits);    
    }, null, 30000);
    
    
});

casper.run(function () {
    casper.done();
});