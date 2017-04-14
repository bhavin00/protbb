var models = require('../models');
var Design = models.Design;
var Measurement = models.Measurement;
var User = models.User;
var DesignMeasurement = models.DesignMeasurement;
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
//

exports.list = function (req, res) {
   req.options.include = [{
        model: DesignMeasurement,
        attributes: ['id', 'DesignId', 'MeasurementId'],
        include: [{
            model: Measurement,
            attributes: ['id', 'title', 'isActive']
        }]
    }];
    req.options.distinct = true;
    Design.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.design);
}

exports.getById = function (req,res,next) {
    Design.findOne({
        where: { id: req.params.designId },
        include: [{ model: DesignMeasurement, include: [Measurement] }]
    }).then(function (obj) {
        req.design = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.create = function (req, res) {
    Design.create(req.body, {
        include: [DesignMeasurement]
    }).then(function (obj) {
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
    var design = req.design;
    _.forEach(req.body, function (val, key) {
        if(key != 'Measurement')
        design.dataValues[key] = val;
    });
    var arrAdd = [];
        //add newly added measurments 
        _.forEach(req.body.DesignMeasurements, function (dt) {
            arrAdd.push({ DesignId: design.dataValues.id, MeasurementId: dt.MeasurementId });
        });
        DesignMeasurement.destroy({
            where: {
                DesignId: design.dataValues.id
            }
        }).then(function (rows) {
            console.log(rows);
            DesignMeasurement.bulkCreate(arrAdd).then(function (ad) {
                console.log(ad);

                Design.update(design.dataValues, {
                    where: {
                        id: req.params.designId
                    }
                }).then(function (obj) {
                    return res.json(obj);
                }).catch(function (error) {
                    return res.status(400).send({ message: getErrorMessage(error) });
                });
            }).catch(function (err) {
                return res.status(400).send({ message: getErrorMessage(error) });
            });
            }).catch(function (err) {
                return res.status(400).send({ message: getErrorMessage(error) });
            });
      
}