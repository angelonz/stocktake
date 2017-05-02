const _ = require('lodash');
const StockTake = require('../stocktakeMaster2');
const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');

const db = require('../util/db');
const redisClient = db.getClient();

function processRequest(request, response, options) {

    const stockTake = new StockTake(options);
    stockTake.getPool().start();
    stockTake.getBalances()
        .then((balances) => {
            
            console.log('balances', balances);
            if (_.isEmpty(balances) || balances[request.params.site] === '-') {
                response.status(HttpStatus.NOT_FOUND);
            }

            response.send(balances);
        }).catch((reason) => {
            console.log(reason);
            handleError(HttpStatus.NOT_FOUND, reason, response);
        });
}

function handleError(status, message, response) {
    response.status(status).send({
        status: status,
        error: message
    });
}

module.exports = {
    getBalance: (request, response) => {

        console.log('decoded payload', request.user);

        redisClient.hget(request.user.email, 'secret', (err, encryptedSecret) => {
            
            const secret = cryptoUtil.decrypt(encryptedSecret, process.env.SERVER_SECRET);

            db.getCredentialsForSite(request.params.site, request.user.email)
                .then((result) => {
                    
                    // true if user has added the site to his list of sites
                    if (!_.isEmpty(result)) {
                        const options = {
                            site: request.params.site,
                            email: request.user.email,
                            credentials: {
                                username: result.username,
                                password: cryptoUtil.decrypt(result.password, secret)
                            }
                        }
                        
                        processRequest(request, response, options);
                    } else {
                        handleError(HttpStatus.NOT_FOUND,
                            `Did not find ${request.params.site} for ${request.user.email}`,
                            response);
                    }

                })
                .catch(function (error) { 
                    console.log(error);
                    handleError(HttpStatus.BAD_REQUEST,
                    'Something went wrong with Redis.',
                    response);
                });

        });    

        

        
    },
    saveSite: (request, response, next) => {

        const email = request.user.email; // get the email from the JWT token
        const {username, password} = request.body;

        redisClient.hget(email, 'secret', (err, encryptedSecret) => {
            
            const secret = cryptoUtil.decrypt(encryptedSecret, process.env.SERVER_SECRET);
            console.log('secret', secret);

            /**
             * creates a hash with key user:<email>:<sitename> then
             * adds the hash key to a Redis Set with key user:<email>:sites
             */
            const promise = redisClient.multi()
                .hmset(`user:${email}:${request.params.site}`,
                    'username', username,
                    'password', cryptoUtil.encrypt(password, secret))
                .sadd(`user:${email}:sites`, `user:${email}:${request.params.site}`)
                .exec();

            // if promise is resolved, send 200    
            promise.then((result) => {
                console.log('result', result);
                response.status(HttpStatus.OK).send({
                    status: HttpStatus.OK
                });
            });    

        });

        
    }
}