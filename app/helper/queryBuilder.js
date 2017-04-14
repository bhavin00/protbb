var _ = require('underscore');
var models = require('../models');
var Design = models.Design;
var Measurement = models.Measurement;
var User = models.User;
var DesignMeasurement = models.DesignMeasurement;

var map = {
    'designmeasurement': DesignMeasurement
}
function parse(dt, val) {
    switch (dt) {
        case 'd':
            return new Date(val);
        case 'a':
            return val.split('.');
        case 'b':
            return val === 'true' ? true : false;
        default:
            return val;
    }
}
var getRestify = function () { };

//http://localhost:3002/api/material?sort=id asc&select=title&where=id;$gt|s|1
//http://localhost:3002/api/material?sort=id asc&select=title&where=title;$like|s|%1%
//http://localhost:3002/api/material?where=isActive;$eq|b|false

function cModel(obj, key) {
    if (key == '' || typeof obj[key] === 'object') {
        for (ky in obj) {
            obj[ky] = cModel(obj, ky);
        }
    }
    else if (typeof obj[key] === 'array') {
        _.forEach(obj[key], function (ob,ok) {
            ob[ok] = cModel(ob, ok);
        });
    }
    else {
        if (key === 'model') {
            obj[key] = map[obj[key].toLowerCase()];
        }
        return obj[key];
    }
}
getRestify.prototype.queryBuilder = function (req, res, next) {
    //for select query
    
    req.options = {
        attributes : [],
        order: '',
        limit: parseInt(req.query.pagesize) || 10000,
        offset : 0,
        page: req.query.page || 0,
        include: include,
        where: {}
    }
    if (req.query.select) {
        _.forEach(req.query.select.split(','), function (slt) {
            req.options.attributes.push(slt);
        });
        //req.options.attributes =  req.query.select.replace(/,/g , ' ');
    }
    if (req.query.include) {
        //req.options.include = req.query.include.replace(/,/g , ' ');
        //get All populated and their select
        //var pop = req.query.include.split(',');
        //pop.forEach(function (item) {
        //    if (item.indexOf(':') > -1) {
        //        var ps = item.split(':');
        //        var popdata = {
        //            model: map[ps[0].toLowerCase()],
        //            attributes: []
        //        };
        //        _.forEach(ps[1].split(' '), function (at) {
        //            popdata.attributes.push(at);
        //        });
        //        req.options.include.push(popdata);
        //    } else {
        //        req.options.include.push({ model: map[item.toLowerCase()]});
        //    }
        //});

        //parse each model
        var include = JSON.parse(req.query.include);
        req.options.include = include;
        cModel(req.options.include,'');

    }
    if (req.query.where) {
        var whr = req.query.where.split(',');
        whr.forEach(function (item) {
            var ws = item.split(';');
            if (ws[1].startsWith('$')) {
                    //split again with -
                    var cond = ws[1].split('*');
                    var key = ws[0];
                    req.options.where[key] = {};
                    cond.forEach(function (citem) {
                        var cdata = citem.split('|');
                        try {
                            req.options.where[key][cdata[0]] = parse(cdata[1], cdata[2]);
                        }
                        catch (e) {
                            console.log(e);
                        }

                    });

            }
            else if(ws[1] != 'undefined')
                req.options.where[ws[0]] = ws[1];
        });
    }

    if (req.query.sort) {
        //remove comma with space
        req.options.order = req.query.sort.replace(/,/g, ' ');
        
    }
    //if (req.query.search) {
    //    var srch = req.query.search.split(',');
    //    srch.forEach(function (item,idx) {
    //        if (item.indexOf(';') > -1) {
    //            var ws = item.split(';');
    //            if (ws[1] != 'undefined') {
    //                if (idx > 0) {
    //                    req.options.search += ' || ';
    //                }
    //                req.options.search += '(this.' + ws[0] + '.toLowerCase().indexOf("' + ws[1].toLowerCase() + '") !== -1)';
    //            }

    //            //to do ---
    //            //for multiple search field either for condition or || and .
    //            //let use $or and $and
    //        }
    //        else {
    //            if (item != 'undefined')
    //            req.options.search += 'this.title.toLowerCase().indexOf("' + item.toLowerCase() + '") !== -1';
    //        }

    //    });
    //    //req.options.search = 'this.title.indexOf("op") !== -1';

    //}
    //if (!req.options.search) {
    //    req.options.search = 'this';
    //}
    if (req.options.limit) {
        req.options.page = req.options.page == 0 ? 0 : req.options.page - 1;
        req.options.offset = req.options.limit * (req.options.page);
    }
    if (!req.options.order) {
        req.options.order = 'id desc';
    }
    if (req.options.attributes.length == 0) {
        delete req.options.attributes;
    }
    next();
};

module.exports = new getRestify();
