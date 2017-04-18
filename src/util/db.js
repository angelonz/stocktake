const Redis = require('ioredis');

const config = {
  redis_server_host: process.env.REDIS_SERVER_HOST || "127.0.0.1",
  redis_server_port: process.env.REDIS_SERVER_PORT || 6379,
  redis_server_password: process.env.REDIS_SERVER_PASSWORD || undefined
};

module.exports = {

    createClient : () => {
        const options = {
            password: config.redis_server_password
        };

        return new Redis(config.redis_server_port, config.redis_server_host, options);
    }
  
};