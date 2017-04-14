var passport = require('passport');

var models = require('../app/models');

module.exports = function () {
    var User = models.User;
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            var usr = user.get({ plain: true });
            done(null, usr);
        })
    });
    
    require('./strategies/local.js')();
};
