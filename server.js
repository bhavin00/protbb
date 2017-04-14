// process.env.NODE_ENV = 'development';
process.env.NODE_ENV = 'production';

var sequelize = require('./config/sequelize.js');
var express = require('./config/express.js');

var passport = require('./config/passport.js');

var db = sequelize();
var app = express();
var passport = passport();

//Listening on port 3002
app.listen(process.env.PORT);
module.exports = app;