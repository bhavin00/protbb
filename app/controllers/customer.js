var models = require('../models');
var Customer = models.Customer;
var User = models.User;
var CustomerMeasurement = models.CustomerMeasurement;
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


//{
//    "name": "Hardik Patel",
//    "gender": "Male",
//    "dob" : "2/23/2017",
//    "annerversary" :"2/23/2010",
//    "phone" : "9033269174",
//    "mobile" : "9033269174",
//    "email" : "akashdeep38@gmail.com",
//    "address" : "c-305, Bharat nagar",
//    "billingAddress" : "c-305, Bharat nagar",
//    "remark" : "anything",
//    "isActive" : true,
//    "createdById" : 1
//  }

//getting List of
//For Geting list of Measurements
exports.list = function (req, res) {
    //include: [{ model: User, as: 'createdBy' }]
    req.options.include = [{ model: User, as: 'createdBy', attributes: ['username', 'id', 'fullname'] }, { model: CustomerMeasurement }];
    req.options.distinct = true;
    Customer.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.staus(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.customer);
}

exports.getById = function (req,res,next) {
    Customer.findOne({
        where: { id: req.params.customerId },
        include: [{ model: User, as: 'createdBy', attributes: ["fullName", "email", "id"] }, CustomerMeasurement]
    }).then(function (obj) {
        req.customer = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.create = function (req, res) {
    req.body.createdById = req.user.id;
    Customer.create(req.body, {
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
    var customer = req.customer;
    _.forEach(req.body, function (val, key) {
        customer.dataValues[key] = val;
    });
    var arrAdd = [];
    //add newly added measurments
    _.forEach(req.body.CustomerMeasurements, function (dt) {
        arrAdd.push({ val: dt.val, CustomerId: customer.dataValues.id, MeasurementId: dt.MeasurementId });
    });
    CustomerMeasurement.destroy({
        where: {
            CustomerId: customer.dataValues.id
        }
    }).then(function (rows) {
        console.log(rows);
        CustomerMeasurement.bulkCreate(arrAdd).then(function (ad) {
            if (customer.dataValues.email == '') {
                customer.dataValues.email = null;
            }
            Customer.update(customer.dataValues, {
                where: {
                    id: customer.dataValues.id
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


    //Customer.update(customer.dataValues, {
    //        where: {
    //            id: req.params.customerId
    //        }
    //    })
    // .then(function (obj) {
    //     return res.json(obj);
    //}).catch(function (error) {
    //    return res.send({ message: getErrorMessage(error) });
    //});

}
