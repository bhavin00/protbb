
"use strict";
module.exports = function(sequelize, DataTypes) {
    var Customer = sequelize.define("Customer", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Customer name must be unique.'
            },
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        annerversary: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        phone: DataTypes.STRING,
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
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
            allowNull: false,
        },
        billingAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        //salt : {
        //    type: DataTypes.STRING,
        //},
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        classMethods: {
            associate: function(models) {
                Customer.hasMany(models.CustomerMeasurement);

                Customer.hasMany(models.Order);

                Customer.belongsTo(models.User, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    },
                    as: 'createdBy'
                });
            }
        }
    });

    return Customer;
};
