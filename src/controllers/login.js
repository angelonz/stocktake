const _ = require('lodash');
const db = require('../util/db');
const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');

const redisClient = db.getClient();

function isVerified(result) {
    console.log('user hasn\'t been verified yet.');
    return result.verified === 'true';
}

function passwordMatches(result, password) {
    // decrypt the secret
    const secret = cryptoUtil.decrypt(result.secret, process.env.SERVER_SECRET);
    console.log('secret', secret);

    // use the decrypted secret to decrypt the password and compare with the provided password
    console.log('password', cryptoUtil.decrypt(result.password, secret));
    return password === cryptoUtil.decrypt(result.password, secret);
}

function authenticate({email, password}) {
    // check if the email exists
    redisClient.hgetall(email, function (err, result) {

        if (!err) {
            if (!_.isEmpty(result)) {

                // check if verified and password matches
                return (isVerified(result) && passwordMatches(result, password));
                    
            } else {
                // email not found
                return false;
                
            }    
        }

    });    
}

module.exports = {
    login: (req, res, next) => {
        if (authenticate(req.body)) {
             console.log('user authenticated');
             next();
        } else {
            res.status(HttpStatus.UNAUTHORIZED).send({
                status: HttpStatus.UNAUTHORIZED,
                error: 'Invalid credentials'
            });
        }
    }
}