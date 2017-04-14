
var design = require('../../app/controllers/design');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/design')
        .get(queryBuilder.queryBuilder, design.list)
        .post(design.create);

    app.route('/api/design/:designId')
        .get(design.read)
        .patch(design.update)
        //.delete(measurement.delete);

    app.param('designId', design.getById);
}