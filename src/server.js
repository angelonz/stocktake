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
const stockTake = require('./stocktakeMaster');

const app = express();

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

    console.log('starting pool...');
  
    stockTake.pool.start();
    stockTake.getBalances()
        .then((balances) => {
            console.log('Promise resolved.')
            //response.writeHead(200, { "Content-Type": "application/json" });
            response.set('Content-Type','appliation/json');
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