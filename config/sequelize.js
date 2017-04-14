var config = require('./config.js');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.dbname, config.dbusername, config.dbpass, {
    host: config.host,
    port: config.port,
    dialect : 'mysql'
});
module.exports = function (){
    return sequelize;
}