const db = require('../util/db');

const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');
const _ = require('lodash');
const uuidV4 = require('uuid/v4');

const redisClient = db.getClient();

function createUser({ email, password, secret }, token) {    
    
    // encrypt the password using the secret then save the json to redis
    const promise = redisClient.hmset(email, 
        'password', cryptoUtil.encrypt(password, secret),
        'secret', secret,
        'verified', false,
        'created', '',
        'token', token);    

    // expire in 10 minutes
    redisClient.expire(email, 600);

    return promise;

}

module.exports = {
    register: (req, res, next) => {

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

                    let token = uuidV4();

                    // createUser returns a promise that we can inspect
                    createUser(req.body, token)
                        .then(function (reply) {                        
                            if (reply === 'OK') {
                                // make the token accessible by the next middleware
                                res.locals.uuid = token;
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
}