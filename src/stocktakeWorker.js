var casperOptions = require('../casperConfig');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('../node_modules/casperjs/modules/casper').create(casperOptions);

module.exports = function(data, done, worker) {

    if (data === 'fotolia') {
        var fotolia = require('../fotolia/fotolia');
        fotolia.getBalance(casper, done);
    }

    if (data === 'bigstockphoto') {
        var bsp = require('../bigstockphoto/bigstockphoto');
        bsp.getBalance(casper, done);
    }

    if (data === 'dreamstime') {
        var dt = require('../dreamstime/dreamstime');
        dt.getBalance(casper, done);
    }

    if (data === 'gettyimages') {
        var dt = require('../gettyimages/getty');
        dt.getBalance(casper, done);
    }

};