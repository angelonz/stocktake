const _ = require('lodash');
const StockTake = require('../stocktakeMaster2');
var HttpStatus = require('http-status-codes');

const NOT_FOUND = 404;

module.exports = {
    getBalances: (request, response, next) => {

        const stockTake = new StockTake(request.params.site);
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
            });
        
    }
}