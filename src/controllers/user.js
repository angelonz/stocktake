const db = require('../util/db');

const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');
const _ = require('lodash');
const uuidV4 = require('uuid/v4');
const emitter = require('../util/eventManager').getEmitter();
const moment = require('moment');

const redisClient = db.getClient();

function createUser({ email, password, secret }, token) {    
    
    // encrypt the password using the secret then save the json to redis
    return redisClient.multi()
        .hmset(email, 
            'password', cryptoUtil.encrypt(password, secret),
            'secret', cryptoUtil.encrypt(secret,process.env.SERVER_SECRET),
            'verified', false,
            'created', moment().format('MMMM Do YYYY, h:mm:ss a'),
            'token', null)
        .expire(email, 1800)
        .exec();        

}

function registrationHandler (req, res, next) {

    redisClient.hgetall(req.body.email, function (err, result) {

            if (!err) {

                if (!_.isEmpty(result)) {

                    // email not yet verified
                    if (result.verified === 'false') {
                        const message = `${req.body.email} already exists but not yet verified.`;
                        console.log(message);
                        res.status(HttpStatus.CONFLICT).send({
                            status: HttpStatus.CONFLICT,
                            error: message
                        });


                    } else {
                        // email already exists
                        const message = `${req.body.email} already exists.`;
                        console.log(message);
                        res.status(HttpStatus.CONFLICT).send({
                            status: HttpStatus.CONFLICT,
                            error: message
                        });
                    }

                    
                } else {

                    // createUser returns a promise that we can inspect
                    createUser(req.body)
                        .then(function (reply) {                        
                            if (reply[0][1] === 'OK') {
                                // make the token accessible by the next middleware
                                res.locals.uuid = uuidV4();
                                next();                                
                            } else {
                                const message = `Failed to create user for ${req.body.email}`;
                                console.log(message);   
                                res.status(HttpStatus.BAD_REQUEST).send({
                                    status: HttpStatus.BAD_REQUEST,
                                    error: message
                                });
                            }
                            
                        });
                                            
                }
            } else {
                console.log(`Redis error on call to exists() for  ${req.body.email}`, err);
                res.status(HttpStatus.BAD_REQUEST).send({
                    status: HttpStatus.BAD_REQUEST,
                    error: `Failed to create user for ${req.body.email}`
                });
            }
            
        });
}

function verificationHandler (req, res, next) {
    console.log('verifying email...');
    if((`${req.protocol}://${req.get('host')}`) === (`http://${process.env.HOST}`)) {

        // convert the 'mail' query parameter back
        const decodedMail = new Buffer(req.query.mail, 'base64').toString('ascii');

        // search for the decoded email in redis
        redisClient.exists(decodedMail, (err, result) => {
            if (result === 0) { // email not found
                console.log(`${decodedMail} not found.`);
                res.status(HttpStatus.BAD_REQUEST).send({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Email not found.'
                });

            } else if (result === 1) { // found

                console.log(`${decodedMail} found.`);
                // check that the token matches
                redisClient.hget(decodedMail, 'token', (err, result) => {
                    
                    if (result === req.query.id) {
                        // if it's a match, set verified to true
                        redisClient.multi()
                            .hmset(decodedMail, 'verified', true, 'token', null)
                            .persist(decodedMail)
                            .exec();

                        res.status(HttpStatus.OK).send({
                            status: HttpStatus.OK
                        });

                    } else {
                        console.log('Token mismatch!');
                        res.status(HttpStatus.BAD_REQUEST).send({
                            status: HttpStatus.BAD_REQUEST,
                            error: 'Token mismatch!'
                        });
                    }
                });
                

            }
        });

    } else {
        res.status(HttpStatus.BAD_REQUEST).send({
            status: HttpStatus.BAD_REQUEST,
            error: 'Request is from unknown source.'
        });
    }
}

/**
 * On successful email sending, set expiry on the entire
 * user record and set the token field
 */
emitter.on('emailSent', (email, token) => {

    console.log('emailSent event received.');

    // set token value
    redisClient.hset(email, 'token', token);
});

module.exports = {
    register: registrationHandler,
    verify: verificationHandler
}