const HttpStatus = require('http-status-codes');

module.exports = {
    sendVerificationEmail: (req, res, next) => {
        console.log('sending verification email...');
        
        res.status(HttpStatus.OK).send({
            status: HttpStatus.OK
        });
        
    }
}