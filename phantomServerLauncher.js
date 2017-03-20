var server = require('webserver').create();
var ipAndPort = '127.0.0.1:8585';

var casperOptions = require('./casperConfig');

var fotolia = require('./fotolia/fotolia');
var bigstock = require('./bigstockphoto/bigstockphoto');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create(casperOptions);

server.listen(ipAndPort, function(request, response) {
    

    if (request.url.indexOf('/fotolia') === 0) {
        console.log('servicing fotolia request...');    

        fotolia.getFotoliaBalance(casper, response);

    } else if (request.url.indexOf('/bigstockphoto') === 0) {
        console.log('servicing bigstockphoto request...');    

        bigstock.getBSPBalance(casper, response);
    }
    

});