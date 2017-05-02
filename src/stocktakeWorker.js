var casperOptions = require('../casperConfig');

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('../node_modules/casperjs/modules/casper').create(casperOptions);

module.exports = function(data, done, worker) {

    if (data.siteName === 'fotolia') {
        var fotolia = require('../sites/fotolia/fotolia');
        fotolia.getBalance(casper, done, data.email);
    }

    if (data.siteName === 'bigstockphoto') {
        var bsp = require('../sites/bigstockphoto/bigstockphoto');
        bsp.getBalance(casper, done, data.email);
    }

    if (data.siteName === 'dreamstime') {
        var dt = require('../sites/dreamstime/dreamstime');
        dt.getBalance(casper, done, data.email);
    }

    if (data.siteName === 'gettyimages') {
        var dt = require('../sites/gettyimages/getty');
        dt.getBalance(casper, done, data.email);
    }

    if (data.siteName === 'snapwire') {
        var dt = require('../sites/snapwire/snapwire');
        dt.getBalance(casper, done, data.email);
    }

    if (data.siteName === '123rf') {
        var dt = require('../sites/123rf/123rf');
        console.log('dt', JSON.stringify(dt));
        dt.getBalance(casper, done, data.email);
    }

    if (data.siteName === 'alamy') {
        var dt = require('../sites/alamy/alamy');
        
        dt.getBalance(casper, done, data.email);
    }

};