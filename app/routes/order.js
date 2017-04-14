
var order = require('../../app/controllers/order');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/order')
        .get(queryBuilder.queryBuilder, order.list)
        .post(order.create);

    app.route('/api/order/:orderId')
        .get(order.read)
        .patch(order.update)
    //.delete(measurement.delete);
    app.route('/api/report')
        .get(queryBuilder.queryBuilder, order.report)
        .post(order.dateByMonth);

    app.route('/api/listall')
        .get(order.listOnly);

    app.route('/api/customerreport')
        .post(order.Customerreport);

    app.param('orderId', order.getById);
}