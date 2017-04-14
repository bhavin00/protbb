
var config = require('./config.js');
var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var models = require("../app/models/index");


module.exports = function() {

    var app = express();

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST,HEAD, OPTIONS,PUT, DELETE, PATCH"); //  "Access-Control-Allow-Methods ", "GET, POST,HEAD, OPTIONS,PUT, DELETE"
        next();
    });
    models.sequelize.sync().then(function() {
        var server = app.listen(app.get('port'), function() {

        });
    });

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/helper/uploadFile')(app);

    //define routing here...
    require('../app/routes/user.js')(app);
    require('../app/routes/index.js')(app);
    require('../app/routes/customer.js')(app);
    require('../app/routes/style.js')(app);
    require('../app/routes/measurement.js')(app);
    require('../app/routes/design.js')(app);
    require('../app/routes/order.js')(app);
    require('../app/routes/material.js')(app);
    require('../app/routes/orderStatus.js')(app);
    require('../app/routes/orderItem.js')(app);

    app.use(express.static('./public'));
    app.use(express.static('./uploads'));
    return app;

}
