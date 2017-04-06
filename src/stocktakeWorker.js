var casperOptions = require('../casperConfig');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('../node_modules/casperjs/modules/casper').create(casperOptions);

module.exports = function(data, done, worker) {

    if (data === 'fotolia') {
        var fotolia = require('../fotolia/fotolia');
        fotolia.getFotoliaBalance(casper, done);
    }

    if (data === 'bigstockphoto') {
        var bsp = require('../bigstockphoto/bigstockphoto');
        bsp.getBSPBalance(casper, done);
    }

    if (data === 'dreamstime') {
        var dt = require('../dreamstime/dreamstime');
        dt.getDTBalance(casper, done);
    }

};