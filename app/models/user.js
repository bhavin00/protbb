"use strict";
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Username must be unique.'
            },
            //validate: {
            //    isEmail: true,
            //}
            },
        password: {
            type: DataTypes.STRING,
            allowNull: false
          
        },
        pwd: {
            type: DataTypes.STRING,
            allowNull: false

        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userrole: {
            allowNull: false,
            type: DataTypes.STRING
        },
        phone: {
            allowNull: false,
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        salt : {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Order);

                User.hasMany(models.Customer);
            }
        }
    }
    //, {
    //    indexes: [
    //        // Create a unique index on email
    //        {
    //            unique: true,
    //            fields: ['username']
    //        }]}
   
    );
    
    return User;
};