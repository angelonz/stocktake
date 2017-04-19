const Redis = require('ioredis');

const config = {
  redis_server_host: process.env.REDIS_SERVER_HOST || "127.0.0.1",
  redis_server_port: process.env.REDIS_SERVER_PORT || 6379,
  redis_server_password: process.env.REDIS_SERVER_PASSWORD || undefined
};

let redis;

module.exports = {
    
    connect : () => {
        const options = {
            password: config.redis_server_password
        };

        redis = new Redis(config.redis_server_port, config.redis_server_host, options);
    },
    getClient: () => {
        return redis;
    }
  
};