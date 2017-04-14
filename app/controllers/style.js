var models = require('../models');
var Style = models.Style;
var User = models.User;
var Design = models.Design;
var Sequelize = require('sequelize');
var fs = require('fs');
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

function DeleteFile(fileKey) {
    fs.unlinkSync("./uploads/" + fileKey);
}

//getting List of 
//For Geting list of Styles
exports.list = function (req, res) {
    req.options.include = [Design];
    req.options.distinct = true;
    Style.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.style);
}

exports.getById = function (req,res,next) {
    Style.findOne({
        where: { id: req.params.styleId},
        //include: []
    }).then(function (obj) {
        req.style = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.create = function (req, res) {
    if (req.file) {
        req.body.style.image = req.file.filename;
    }
    if (req.body.style.id) {
        Style.update(req.body.style, {
            where: {
                id: req.body.style.id
            }
        }) .then(function (obj) {
                return res.json(obj);
            }).catch(function (error) {
                return res.status(400).send({ message: getErrorMessage(error) });
            });
    } else {
        Style.create(req.body.style).then(function (obj) {
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
}

exports.update = function (req, res) {
    var style = req.style;
    _.forEach(req.body, function (val, key) {
        style.dataValues[key] = val;
    });
    Style.update(style.dataValues, {
            where: {
                id: req.params.styleId
            }
        })
     .then(function (obj) {
         return res.json(obj);
    }).catch(function (error) {
        return res.status(400).send({ message: getErrorMessage(error) });
    });

}