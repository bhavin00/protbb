var User = require('../models').User;
var passport = require('passport');
var crypto = require('crypto');
var _ = require('underscore');
//get Error Message Consized
var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } 
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }
    return message;
};


//{
//    "username": "akash",
//    "password": "iamakash",
//    "fullname" : "Akashdeep Shah",
//    "userrole" : "admin",
//    "phone" : "9033269174",
//    "email" : "akashdeep38@gmail.com",
//    "address" : "c-305, Bharat nagar",
//    "isActive" : true
//  }

exports.list = function (req, res) {
    User.findAndCountAll(req.options).then(function (arrs) {
        res.setHeader('total', arrs.count);
        res.json(arrs.rows);
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

exports.read = function (req, res) {
    res.json(req.userData);
}

exports.getById = function (req, res, next) {
    User.findOne({
        where: { id: req.params.userId },
    }).then(function (obj) {
        req.userData = obj;
        next();
    }).catch(function (err) {
        console.log(err);
        res.status(400).send({ message: getErrorMessage(err) });
    });
}

//Sign Up procedure
exports.create = function (req, res, next) {
    var salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64').toString('base64');
    var password = crypto.pbkdf2Sync(req.body.password,salt, 10000, 64).toString('base64');
    //check for unique UserName
    User.find({
        where: {
            username: req.body.username
        }
    }).then(function (unqusr) { 
        if (unqusr == null) {
            req.body.salt = salt;
            req.body.pwd = req.body.password;
            req.body.password = password;
            User.create(req.body)
        .then(function (usr) {
                if (!usr) {
                    return res.status(400).send({ message : "Error Occured while updataing." });
                }
                var usrdata = usr.get({
                    plain: true
                });
                return res.json(usrdata);
            });
        }
        else {
            res.status(400).send({ message : "User Already Exist." });
        }
    }).catch(function (err) {
        res.status(400).send({ message : getErrorMessage(err) });
    });
   
   
};

exports.reset = function (req, res, next) {
    var salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64').toString('base64');
    var password = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64).toString('base64');
    req.body.salt = salt;
    req.body.pwd = req.body.password;
    req.body.password = password;
    User.update(req.body, {
        where: {
            id: req.params.userId
        }
    }).then(function (obj) {
        return res.json(obj);
    }).catch(function (error) {
        return res.status(400).send({ message: getErrorMessage(error) });
    });
};


exports.update = function (req, res) {
    var usr = req.userData;
    _.forEach(req.body, function (val, key) {
        usr.dataValues[key] = val;
    });

    if (!usr.dataValues.email) {
        usr.dataValues.email = undefined;
    }
    User.update(usr.dataValues, {
        where: {
            id: req.params.userId
        }
    }).then(function (obj) {
            return res.json(obj);
        }).catch(function (error) {
            return res.status(400).send({ message: getErrorMessage(error) });
        });

}

//Signout Procedure
exports.signout = function (req, res) {
    req.logout();
    return res.redirect('/');
    //req.session.destroy(function (err) {
    //    if (err) { return next(err); }
    //    // The response should indicate that the user is no longer authenticated.
    //    return res.send({ authenticated: req.isAuthenticated() });
    //});
};


//Reading User Details to json
//exports.read = function (req, res) {
//    res.json(req.user);
//}


//Check For Require Login
exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in.'
        });
    }
    next();
};

//Check For IsAdmin
exports.isAdmin = function (req, res, next) {
    if (req.user.userrole != "admin") {
        return res.status(401).send({
            message: 'Admin Authorized Only.'
        });
    }
    next();
};




