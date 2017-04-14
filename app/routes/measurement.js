
var measurement = require('../../app/controllers/measurement');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/measurement')
        .get(queryBuilder.queryBuilder, measurement.list)
        .post(measurement.create);

    app.route('/api/measurement/:measurementId')
        .get(measurement.read)
        .patch(measurement.update)
        //.delete(measurement.delete);

    app.param('measurementId', measurement.getById);
}