const Redis = require('ioredis');
const cryptoUtil = require('../util/cryptoUtil');
const _ = require('lodash');

Redis.Promise.onPossiblyUnhandledRejection(function (error) {
  // log all unhandled redis issues here
  
   console.error('An unhandled Redis error was encountered.', error);
   console.error('The command and arguments that caused the Redis error are:', error.command.name, error.command.args);
});

const config = {
  redis_server_host: process.env.REDIS_SERVER_HOST || "127.0.0.1",
  redis_server_port: process.env.REDIS_SERVER_PORT || 6379,
  redis_server_password: process.env.REDIS_SERVER_PASSWORD || undefined
};

let redis;

const decryptSecret = (encryptedSecret) => {
    const secret = cryptoUtil.decrypt(encryptedSecret, process.env.SERVER_SECRET);
    return Promise.resolve(secret);
};

/** Handles fetching credentials for a particular site */
function getCredentialsForSiteHandler (site, email) {
    
    const fetchCredentials = (secret) => {
        return new Promise((resolve, reject) => {
            redis.hgetall(`user:${email}:${site}`)
                .then((result) => {

                    // true if user has added the site to his list of sites
                    if (!_.isEmpty(result)) {
                        const credentials = {
                            username: result.username,
                            password: cryptoUtil.decrypt(result.password, secret)
                        }
                        
                        resolve(credentials);
                    } else {
                        reject({});
                    }

                });
        });
    };

    return redis.hget(email, 'secret')
        .then(decryptSecret)
        .then(fetchCredentials);

}

function saveSiteHandler(site, email, username, password) {

    const save = (secret) => {
        return new Promise((resolve, reject) => {

            /**
             * creates a hash with key user:<email>:<sitename> then
             * adds the hash key to a Redis Set with key user:<email>:sites
             */
            const promise = redis.multi()
                .hmset(`user:${email}:${site}`,
                    'username', username,
                    'password', cryptoUtil.encrypt(password, secret))
                .sadd(`user:${email}:sites`, `user:${email}:${site}`)
                .exec();

            promise.then((result) => {
                console.log('result', result);
                // if all good, resolve the promise with the email
                resolve(email);
            }).catch((error) => {
                reject(error);
            });    

        });    
    };

    return redis.hget(email, 'secret')
        .then(decryptSecret)
        .then(save)
        .then(getAllSitesForUser);
}

const getAllSitesForUser = (email) => {
    return new Promise((resolve, reject) => {

        redis.smembers(`user:${email}:sites`)
            .then((result) => {

                console.log(result);
                if (result.length === 0) {
                    console.log(result.isEmpty);
                    resolve([]);
                }

                let sites = [];    
                result.forEach((site) => {
                    
                    let content = {};

                    redis.hget(site, 'username', (err, value) => {
                        content.username = value;
                        content.site = site.split(':')[2];
                        console.log('adding site', content);
                        sites.push(content);

                        // there must be a better way!
                        if (sites.length === result.length) {
                            console.log('resolving sites');
                            resolve(sites);
                        }

                    });

                    
                });


            });

    });
}

module.exports = {
    
    connect : () => {
        const options = {
            password: config.redis_server_password
        };

        redis = new Redis(config.redis_server_port, config.redis_server_host, options);
    },
    getClient: () => {
        return redis;
    },
    getCredentialsForSite: getCredentialsForSiteHandler,
    saveSite: saveSiteHandler,
    getAllSitesForUser

};
