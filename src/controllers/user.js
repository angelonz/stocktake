const db = require('../util/db');

const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');
const _ = require('lodash');
const uuidV4 = require('uuid/v4');
const emitter = require('../util/eventManager').getEmitter();
const moment = require('moment');

const redisClient = db.getClient();

function createUser({ email, password, secret, firstName, lastName }, token) {    
    
    // encrypt the password using the secret then save the json to redis
    return redisClient.multi()
        .hmset(email.toLowerCase(), 
            'firstName', firstName,
            'lastName', lastName,
            'password', cryptoUtil.encrypt(password, secret),
            'secret', cryptoUtil.encrypt(secret,process.env.SERVER_SECRET),
            'verified', false,
            'created', moment().format('MMMM Do YYYY, h:mm:ss a'),
            'token', null)
        .expire(email, 1800)
        .exec();        

}

function registrationHandler (req, res, next) {
    console.log('registrationHandler', req.body);
    redisClient.hgetall(req.body.email.toLowerCase(), function (err, result) {

            if (!err) {

                if (!_.isEmpty(result)) {

                    // email not yet verified
                    if (result.verified === 'false') {
                        const message = `${req.body.email} already exists but not yet verified.`;
                        console.log(message);
                        res.status(HttpStatus.CONFLICT).send({
                            status: HttpStatus.CONFLICT,
                            error: 'You have previously registered but have not verified your email yet.  Please check your email to activate your account.'
                        });


                    } else {
                        // email already exists
                        const message = `${req.body.email} already exists.`;
                        console.log(message);
                        res.status(HttpStatus.CONFLICT).send({
                            status: HttpStatus.CONFLICT,
                            error: 'You are already registered.  Please proceed to the login page.'
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
                                    error: 'Something has gone wrong in the registration process.  Please try again later.'
                                });
                            }
                            
                        });
                                            
                }
            } else {
                console.log(`Redis error on call to exists() for  ${req.body.email}`, err);
                res.status(HttpStatus.BAD_REQUEST).send({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Something has gone wrong in the registration process.  Please try again later.'
                });
            }
            
        });
}

function verificationHandler (req, res, next) {
    console.log('verifying email...');
    if((`${req.protocol}://${req.get('host')}`) === (`http://${process.env.HOST}`)) {

        // convert the 'mail' query parameter back
        const decodedMail = new Buffer(req.query.mail, 'base64').toString('ascii').toLowerCase();

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
                redisClient.hmget(decodedMail, 'verified','token', (err, result) => {
                    console.log('result', result);
                    // already verified
                    if (result[0] === 'true') {
                        res.status(HttpStatus.OK).send({
                            status: HttpStatus.OK
                        });
                    } else {
                        
                        if (result[1] === req.query.id) {
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
    redisClient.hset(email.toLowerCase(), 'token', token);
});

module.exports = {
    register: registrationHandler,
    verify: verificationHandler
}
