const db = require('../util/db');
const redisClient = db.createClient();
const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');

const ALREADY_EXISTS = 1;

function createUser({ email, password, secret }) {    
    return redisClient.hmset(email, 'password', cryptoUtil.encrypt(password, secret), 'secret', secret);    
}

module.exports = {
    register: (req, res, next) => {

        redisClient.exists(req.body.email, function (err, result) {
            if (!err) {
                if (result === ALREADY_EXISTS) {
                    // email already exists
                    console.log('already exists');
                    res.status(HttpStatus.CONFLICT).send();
                } else {
                    // createUser returns a promise that we can inspect
                    createUser(req.body)
                        .then(function (reply) {                        
                            if (reply === 'OK') {
                                res.status(HttpStatus.OK).send();
                            } else {
                                res.status(HttpStatus.BAD_REQUEST).send();
                            }
                            
                        });
                                            
                }
            }
            
        });
        
    }
}