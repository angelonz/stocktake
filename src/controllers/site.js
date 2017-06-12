const _ = require('lodash');
const StockTake = require('../stocktakeMaster2');
const HttpStatus = require('http-status-codes');

const db = require('../util/db');

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

        db.getCredentialsForSite(request.params.site, request.user.email)
            .then((credentials) => {
                
                const options = {
                    site: request.params.site,
                    email: request.user.email,
                    credentials
                };

                processRequest(request, response, options);

            })
            .catch((error) => { 
                handleError(HttpStatus.NOT_FOUND,
                        `Did not find ${request.params.site} for ${request.user.email}`,
                        response);
            });


    },
    saveSite: (request, response, next) => {

        const email = request.user.email; // get the email from the JWT token
        const {username, password} = request.body;

        // saves the site information and returns all the user's saved site upon successful creation
        db.saveSite(request.params.site, email, username, password)
            .then((sites) => {
                response.status(HttpStatus.CREATED).send({
                    status: HttpStatus.CREATED,
                    sites
                });
            }).catch((error) => {
                console.error(error);
                handleError(HttpStatus.INTERNAL_SERVER_ERROR,
                    `An error occurred while saving ${request.params.site} for ${request.user.email}`,
                    response);
            });

    },
    getAllSitesForUser: (request, response) => {
        // if we're here, it means that the user already passed authentication
        const email = request.body.email;
        db.getAllSitesForUser(email)
            .then((sites) => {

                response.status(HttpStatus.OK).send({
                    status: HttpStatus.OK,
                    jwt: response.locals.jwt,
                    firstName: response.locals.firstName,
                    lastName: response.locals.lastName,
                    sites
                });

            });

    }
}
