
var customer = require('../../app/controllers/customer');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/customer')
        .get(queryBuilder.queryBuilder, customer.list)
        .post(customer.create);

    app.route('/api/customer/:customerId')
        .get(customer.read)
        .patch(customer.update)
        //.delete(measurement.delete);

    app.param('customerId', customer.getById);
}
