var casperOptions = require('../casperConfig');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('../node_modules/casperjs/modules/casper').create(casperOptions);

module.exports = function(data, done, worker) {

    if (data === 'fotolia') {
        var fotolia = require('../sites/fotolia/fotolia');
        fotolia.getBalance(casper, done);
    }

    if (data === 'bigstockphoto') {
        var bsp = require('../sites/bigstockphoto/bigstockphoto');
        bsp.getBalance(casper, done);
    }

    if (data === 'dreamstime') {
        var dt = require('../sites/dreamstime/dreamstime');
        dt.getBalance(casper, done);
    }

    if (data === 'gettyimages') {
        var dt = require('../sites/gettyimages/getty');
        dt.getBalance(casper, done);
    }

    if (data === 'snapwire') {
        var dt = require('../sites/snapwire/snapwire');
        dt.getBalance(casper, done);
    }

    if (data === '123rf') {
        var dt = require('../sites/123rf/123rf');
        dt.getBalance(casper, done);
    }

    if (data === 'alamy') {
        var dt = require('../sites/alamy/alamy');
        dt.getBalance(casper, done);
    }

};