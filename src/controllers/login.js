const _ = require('lodash');
const db = require('../util/db');
const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');
var jwt = require('jsonwebtoken');

const redisClient = db.getClient();

function isVerified(result) {
    console.log('user hasn\'t been verified yet.');
    return result.verified === 'true';
}

function passwordMatches(result, password) {
    // decrypt the secret
    const secret = cryptoUtil.decrypt(result.secret, process.env.SERVER_SECRET);

    // use the decrypted secret to decrypt the password and compare with the provided password
    console.log('password match', password === cryptoUtil.decrypt(result.password, secret));
    return password === cryptoUtil.decrypt(result.password, secret);
}

/**
 * Generates a JSON Web Token with a 1 hour expiry.
 * Should only be called after successful authentication
 */
function generateJWT(email) {
    // parameters are: payload, secret, options
    return jwt.sign({
            email: email
        }, 
        process.env.JWT_SECRET, 
        {
            algorithm: 'HS256',
            expiresIn: '1h'
        }        
    );
}

/**
 * Looks for the user in the database.
 * @return Returns a Promise object
 */
function getUserRecord(email) {
    // check if the email exists
    return redisClient.hgetall(email);
}

/**
 * Authenticates the user based on email and password
 * @param {email, password} the email and password 
 * @return A promise object that will get resolved if the user was successfully authenticated
 *          else the promise is rejected
 */
function authenticate({email, password}) {

    return new Promise((resolve, reject) => {

        getUserRecord(email.toLowerCase())
            .then((result) => {
                if (!_.isEmpty(result)) {

                    // check if verified and password matches
                    //return (isVerified(result) && passwordMatches(result, password));
                    if (isVerified(result) && passwordMatches(result, password)) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                        
                } else {
                    // email not found
                    reject(false);
                    
                }    
            })
            .catch((err) => {
                reject(false);
            });

    });

}

module.exports = {
    login: (req, res) => {
        
        authenticate(req.body)
            .then((result) => {
                console.log('user authenticated');
                const jwt = generateJWT(req.body.email.toLowerCase());
                console.log('jwt', jwt);

                res.status(HttpStatus.OK).send({
                    status: HttpStatus.OK,
                    jwt: jwt
                });
            })
            .catch((err) => {
                res.status(HttpStatus.UNAUTHORIZED).send({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Invalid credentials'
                });
            });

    }
}
