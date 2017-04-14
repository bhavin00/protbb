var models = require('../models');
var Measurement = models.Measurement;
var User = models.User;
var Sequelize = require('sequelize');
var _ = require('underscore');
//get Error Message Consized
var getErrorMessage = function (err) {
    if (err.errors) {
        for (var errorName in err.errors) {
            if (err.errors[errorName].message) {
                return err.errors[errorName].message;
            }
        }
    } else {
        return 'Unknown Server Error';
    }
}

//getting List of 
//For Geting list of Measurements
exports.list = function (req, res) {
    Measurement.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.measurement);
}

exports.getById = function (req,res,next) {
    Measurement.findOne({
        where: { id: req.params.measurementId},
        //include: []
    }).then(function (obj) {
        req.measurement = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.create = function (req, res) {
    Measurement.create(req.body).then(function (obj) {
        if (!obj) {
            return res.send({ message: "Error Occured while updataing" });
        }
        var objData = obj.get({
            plain: true
        });
        return res.json(objData);
    }).catch(function (error) {
        console.log(error);
        res.status(400).send({ message: getErrorMessage(error) });
    });
}

exports.update = function (req, res) {
    var measurement = req.measurement;
    _.forEach(req.body, function (val, key) {
        measurement.dataValues[key] = val;
    });
    Measurement.update(measurement.dataValues, {
            where: {
                id: req.params.measurementId
            }
        })
     .then(function (obj) {
         return res.json(obj);
    }).catch(function (error) {
        return res.status(400).send({ message: getErrorMessage(error) });
    });

}