"use strict";
module.exports = function (sequelize, DataTypes) {
    var Order = sequelize.define("Order", {
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        totalamount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }

    }, {
            classMethods: {
                associate: function (models) {
                    Order.hasMany(models.OrderItem);

                    Order.hasMany(models.OrderHistory);

                    Order.belongsTo(models.Customer, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    Order.belongsTo(models.OrderStatus, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    Order.belongsTo(models.User, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return Order;
};