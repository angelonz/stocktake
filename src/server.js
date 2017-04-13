"use strict";

const express = require('express');

const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const expressStatusMonitor = require('express-status-monitor');
const lusca = require('lusca');
const _ = require('lodash');

//const stockTake = require('./stocktakeMaster');
const StockTake = require('./stocktakeMaster2');

const NOT_FOUND = 404;
const OK = 200;

const app = express();

require('dotenv').load();

app.set('port', process.env.PORT || 3000);
app.use(expressStatusMonitor());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

/*
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
  
}));
*/

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

/**
 * routes
 */
app.get('/api/balances', (request, response, next) => {

    const stockTake = new StockTake();
    stockTake.getPool().start();
    stockTake.getBalances()
        .then((balances) => {
            //response.writeHead(200, { "Content-Type": "application/json" });
            //response.set('Content-Type','appliation/json');
            response.send(balances);
        }).catch((reason) => {
            console.log(reason);
        });
    
});

/**
 * Route to handle individual site requests
 */
app.get('/api/:site', (request, response, next) => {

    const stockTake = new StockTake(request.params.site);
    stockTake.getPool().start();
    stockTake.getBalances()
        .then((balances) => {
            
            console.log('balances', balances);
            if (_.isEmpty(balances) || balances[request.params.site] === '-') {
              response.status(NOT_FOUND);
            }

            response.send(balances);
        }).catch((reason) => {
            console.log(reason);
        });
    
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;