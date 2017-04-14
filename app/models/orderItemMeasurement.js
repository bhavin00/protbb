"use strict";
module.exports = function (sequelize, DataTypes) {
    var OrderItemMeasurement = sequelize.define("OrderItemMeasurement", {
        val: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
            classMethods: {
                associate: function (models) {
                    OrderItemMeasurement.belongsTo(models.OrderItem, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: true
                        }
                    });

                    OrderItemMeasurement.belongsTo(models.Measurement, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: true
                        }
                    });
                }
            }
        }
    );

    return OrderItemMeasurement;
};