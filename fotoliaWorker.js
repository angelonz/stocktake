var casperOptions = require('./casperConfig');
var config = require('./fotolia/fotoliaConfig');

phantom.casperPath = '/d/dev/sandbox/stocktake/node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create(casperOptions);

var webpage = require('webpage');

module.exports = function(data, done, worker) {
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
        casper.done();
        done(null);
    });

};