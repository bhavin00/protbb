var models = require('../models');
var Order = models.Order;
var OrderStatus = models.OrderStatus;
var Customer = models.Customer;
var Measurement = models.Measurement;
var OrderItem = models.OrderItem;
var Style = models.Style;
var Material = models.Material;
var Design = models.Design;
var OrderItemMeasurement = models.OrderItemMeasurement;
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
//For Geting list of Orders
exports.list = function (req, res) {
    req.options.include = [{ model: OrderItem, include: [{ model: OrderItemMeasurement, include: [Measurement] }, Design, Material, OrderStatus, Style] }, Customer, OrderStatus];
    req.options.distinct = true;
    Order.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.dateByMonth = function (req, res, next) {

    Order.findAll({
        where: {
            orderDate: {
                $between: [req.body.start, req.body.end]
            }
        }
        // group: [Sequelize.fn('date_trunc', 'day', Sequelize.col('orderDate'))]
    }).then(function (obj) {
        res.json(obj);
    }).catch(function (err) {
        res.json(err);
    });
}


exports.listOnly = function (req, res) {
    // req.options.include = [{ model: OrderItem, include: [{ model: OrderItemMeasurement, include: [Measurement] }, Design, Material, OrderStatus, Style] }, Customer, OrderStatus];
    // req.options.distinct = true;
    Order.findAll().then(function (arrs) {
        // res.setHeader('total', arrs.count);
        res.json(arrs);
    }).catch(function (err) {
        res.json(err);
        // console.log(err);
        // res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.report = function (req, res) {
    req.options.include = [{ model: OrderItem, include: [Design, OrderStatus, Style] }, Customer];
    req.options.distinct = true;
    Order.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}


exports.read = function (req, res) {
    res.json(req.order);
}

exports.getById = function (req, res, next) {
    Order.findOne({
        where: { id: req.params.orderId },
        include: [{ model: OrderItem, include: [{ model: OrderItemMeasurement, include: [Measurement] }, Style, Material, Design, OrderStatus] }, Customer, OrderStatus, User]
    }).then(function (obj) {
        req.order = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.Customerreport = function (req, res, next) {
    console.log(req.body);
    Order.findAll({
        where: { CustomerId: req.body.CustomerId },
        include: [{
            model: OrderItem, where: {
                OrderStatusId: {
                    $in: req.body.OrderStatusId, 
                }, 
                createdAt: {
                    $between: [req.body.start, req.body.end]
                }
            }, include: [Design, OrderStatus]
        }, Customer]
    }).then(function (obj) {
        res.json(obj);
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}



//{
//    "OrderStatusId": 1,
//        "OrderItems": [
//            {
//                "DesignId": "1",
//                "StyleId": "1",
//                "MaterialId": "",
//                "colorCode": "",
//                "customization": "",
//                "remark": "",
//                "image": "",
//                "pair": 1488646287173,
//                "OrderItemMeasurements": [
//                    {
//                        "MeasurementId": 1,
//                        "val": "12"
//                    },
//                    {
//                        "MeasurementId": 2,
//                        "val": "123"
//                    }
//                ],
//                "OrderStatusId": 1,
//                "deliveryDate": "2017-03-04T18:30:00.000Z",
//                "stitchingDate": "2017-03-10T18:30:00.000Z",
//                "alertDate": "2017-03-08T18:30:00.000Z",
//                "amount": 123
//            }
//        ],
//            "orderDate": "2017-03-04T16:51:27.160Z",
//                "CustomerId": "1"
//}


exports.create = function (req, res) {
    if (req.files) {
        req.body.style.image = req.file.filename;
    }
    _.forEach(req.body.order.OrderItems, function (oi, idx) {
        if (oi.MaterialId == '' || oi.MaterialId == 'null') {
            oi.MaterialId = null;
        }
    });
    if (!req.body.order.id) {
        req.body.order.UserId = req.user.id;

        Order.create(req.body.order, {
            include: [{ model: OrderItem, include: { model: OrderItemMeasurement } }]
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
    } else {
        //update order and it's order item and it's Measurement
        //order ---> orderitems ---> orderitemsmeasurements.
        //var tArr = [];
        _.forEach(req.body.order.OrderItems, function (dt) {
            //tArr.push(dt.OrderStatusId);
            if (dt.OrderStatusId == '3') {
                dt.completeDate = new Date();
            }
            else {
                dt.completeDate = null;
            }
            if (dt.OrderStatusId == '4') {
                dt.cancelDate = new Date();
            }
            else {
                dt.cancelDate = null;
            }
            OrderItem.update(dt, { where: { id: dt.id } }).then(function (dtw) {
                console.log(dtw);
            }).catch(function (er) {
                console.log(err);
            });
            _.forEach(dt.OrderItemMeasurements, function (dm) {
                OrderItemMeasurement.update(dm, { where: { id: dm.id } });
            });
        });
        //Mnagae order status according to it's items status
        //1 : New - when all are in new
        //var gb = _.groupBy(tArr);
        //if (gb[1] && gb[1].length === tArr.length) {
        //    req.body.OrderStatusId = 1;
        //} else if (gb[2] && gb[2].length > 0) {
        //    req.body.OrderStatusId = 2;
        //} else if (gb[3] && gb[3].length === tArr.length) {
        //    req.body.OrderStatusId = 3;
        //} else if (gb[4] && gb[4].length === tArr.length) {
        //    req.body.OrderStatusId = 4;
        //} else {
        //    req.body.OrderStatusId = 5;
        //}

        Order.update(req.body.order, { where: { id: req.body.order.id } })
            .then(function (obj) {
                return res.json(obj);
            })
            .catch(function (error) {
                return res.status(400).send({ message: getErrorMessage(error) });
            });
    }
}

exports.update = function (req, res) {
    var order = req.order;
    _.forEach(req.body, function (val, key) {
        order.dataValues[key] = val;
    });
    Order.update(order.dataValues, {
        where: {
            id: req.params.orderId
        }
    })
        .then(function (obj) {
            return res.json(obj);
        }).catch(function (error) {
            return res.status(400).send({ message: getErrorMessage(error) });
        });

}
