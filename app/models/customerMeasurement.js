"use strict";
module.exports = function (sequelize, DataTypes) {
    var CustomerMeasurement = sequelize.define("CustomerMeasurement", {
        val: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
            classMethods: {
                associate: function (models) {
                    CustomerMeasurement.belongsTo(models.Customer, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    CustomerMeasurement.belongsTo(models.Measurement, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return CustomerMeasurement;
};