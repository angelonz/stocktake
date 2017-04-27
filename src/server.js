'use strict';

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
const db = require('./util/db');

// start the connection to redis
db.connect();

/**
 * Controllers
 */
const siteController = require('./controllers/site');
const userController = require('./controllers/user');
const emailController = require('./controllers/email');
const loginController = require('./controllers/login');

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

//app.use(lusca.xframe('SAMEORIGIN'));
//app.use(lusca.xssProtection(true));

/**
 * Route to handle individual site requests
 */
app.get('/api/:site', siteController.getBalances);

/**
 * Route for user registration
 */
app.post('/register', userController.register, emailController.sendVerificationEmail);

/**
 * Route for email verification
 */
app.get('/verify', userController.verify);

app.post('/login', loginController.login);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;