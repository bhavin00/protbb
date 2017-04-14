
var orderStatus = require('../../app/controllers/orderStatus');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/orderStatus')
        .get(queryBuilder.queryBuilder, orderStatus.list)
        .post(orderStatus.create);

    app.route('/api/orderStatus/:orderStatusId')
        .get(orderStatus.read)
        .patch(orderStatus.update)
        //.delete(orderStatus.delete);

    app.param('orderStatusId', orderStatus.getById);
}