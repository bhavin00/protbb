var models = require('../models');
var OrderStatus = models.OrderStatus;
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


//order status has fixed id as mentioned below. use accordingly
//1 : New
//2 : Stitching
//3 : Completed
//4 : Cancelled


//getting List of 
//For Geting list of OrderStatuss
exports.list = function (req, res) {
    OrderStatus.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.orderStatus);
}

exports.getById = function (req,res,next) {
    OrderStatus.findOne({
        where: { id: req.params.orderStatusId},
        //include: []
    }).then(function (obj) {
        req.orderStatus = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.create = function (req, res) {
    OrderStatus.create(req.body).then(function (obj) {
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
    var orderStatus = req.orderStatus;
    _.forEach(req.body, function (val, key) {
        orderStatus.dataValues[key] = val;
    });
    OrderStatus.update(orderStatus.dataValues, {
            where: {
                id: req.params.orderStatusId
            }
        })
     .then(function (obj) {
         return res.json(obj);
    }).catch(function (error) {
        return res.status(400).send({ message: getErrorMessage(error) });
    });

}