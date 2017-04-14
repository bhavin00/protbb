var users = require('../../app/controllers/user.js');
var queryBuilder = require('../../app/helper/queryBuilder');
var passport = require('passport');

module.exports = function (app) {
    
    app.route('/api/user')
        .get(queryBuilder.queryBuilder, users.list)
        .post(users.create);

    app.route('/api/user/:userId')
        .get(users.read)
        .patch(users.update);
    app.route('/api/user/:userId/reset')
        .patch(users.reset);
    //.delete(measurement.delete);

    app.param('userId', users.getById);
    
    //My Custom routing For Angular JS login and signup
    //Local signin and signup routing
   
    app.post('/signin', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) { return res.send({ message : err.data.message }) }
            // Redirect if it fails
            if (!user) { return res.send({ message : "Invalid Username or Password." }) }
            if (!user.isActive) { return res.send({ message : "The Username is Inactive. Kindly contact your administration." }) }
            req.logIn(user, function (err) {
                if (err) { return res.send({ message : err.data.message }) }
                // Redirect if it succeeds
                return res.json(user);
            });
        })(req, res, next);
    });
    
    app.get('/signout', users.signout);
};