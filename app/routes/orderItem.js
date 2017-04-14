
var orderItem = require('../../app/controllers/orderItem');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/orderItem')
        .get(queryBuilder.queryBuilder, orderItem.list)
        .post(orderItem.create);

    app.route('/api/orderItem/:orderItemId')
        .get(orderItem.read)
        .patch(orderItem.update);
        //.delete(measurement.delete);
    
    app.route('/api/notify')
        .get(queryBuilder.queryBuilder, orderItem.notify);

    app.param('orderItemId', orderItem.getById);
}