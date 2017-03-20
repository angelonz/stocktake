var server = require('webserver').create();
var ipAndPort = '127.0.0.1:8585';

var casperOptions = require('./casperConfig');
var config = require('./fotolia/fotoliaConfig');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create(casperOptions);

server.listen(ipAndPort, function(request, response) {
    
    
    
    if (request.url.indexOf('/fotolia') === 0) {
        console.log('servicing fotolia request...');    

        

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
            casper.done();
        });

        
    }
    

});