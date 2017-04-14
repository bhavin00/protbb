
var style = require('../../app/controllers/style');
var queryBuilder = require('../../app/helper/queryBuilder');

module.exports = function (app) {
    app.route('/api/style')
        .get(queryBuilder.queryBuilder, style.list)
        .post(style.create);

    app.route('/api/style/:styleId')
        .get(style.read)
        .patch(style.update)
        //.delete(style.delete);

    app.param('styleId', style.getById);
}