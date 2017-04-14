var models = require('../models');
var OrderItem = models.OrderItem;
var Customer = models.Customer;
var CustomerMeasurement = models.CustomerMeasurement;
var OrderItemMeasurement = models.OrderItemMeasurement;
var Style = models.Style;
var Design = models.Design;
var OrderStatus = models.OrderStatus;
var Order = models.Order;
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
    req.options.include = [{ model: Order, include: [{ model: Customer }] }, { model: Design }, { model: Style }, { model: OrderStatus }];
    req.options.distinct = true;
    OrderItem.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.notify = function (req, res) {
    req.options.include = [{ model: Design }, { model: Style }];
    req.options.distinct = true;
    OrderItem.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.orderItem);
}

exports.getById = function (req, res, next) {
    OrderItem.findOne({
        where: { id: req.params.orderItemId },
        include: [{ model: User, as: 'createdBy', attributes: ["fullName", "email", "id"] }, CustomerMeasurement]
    }).then(function (obj) {
        req.orderItem = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.create = function (req, res) {
    OrderItem.create(req.body, {
        include: [CustomerMeasurement]
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

    OrderItem.update(orderItem.dataValues, {
        where: {
            id: req.params.orderItemId
        }
    })
        .then(function (obj) {
            return res.json(obj);
        }).catch(function (error) {
            return res.status(400).send({ message: getErrorMessage(error) });
        });

}