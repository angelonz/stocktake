const _ = require('lodash');
const StockTake = require('../stocktakeMaster2');
const HttpStatus = require('http-status-codes');
const cryptoUtil = require('../util/cryptoUtil');

const db = require('../util/db');
const redisClient = db.getClient();

module.exports = {
    getBalance: (request, response, next) => {

        console.log('decoded payload', request.user);

        const stockTake = new StockTake(request.params.site, request.user.email);
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
                response.status(HttpStatus.NOT_FOUND).send({
                    status: HttpStatus.NOT_FOUND,
                    error: reason
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