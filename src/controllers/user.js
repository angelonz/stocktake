const db = require('../util/db');
const redisClient = db.createClient();
const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');
const _ = require('lodash');

function createUser({ email, password, secret }) {    
    // encrypt the password using the secret then save the json to redis
    return redisClient.hmset(email, 
        'password', cryptoUtil.encrypt(password, secret),
        'secret', secret,
        'verified', false);    
}

module.exports = {
    register: (req, res, next) => {

        redisClient.hmget(req.body.email, 'verified', function (err, result) {

            if (!err) {

                if (!_.isNull(result)) {

                    // email not yet verified
                    if (result[0] === 'false') {
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
                            if (reply === 'OK') {
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