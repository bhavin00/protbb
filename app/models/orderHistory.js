"use strict";
module.exports = function (sequelize, DataTypes) {
    var OrderHistory = sequelize.define("OrderHistory", {
       
    }, {
            classMethods: {
                associate: function (models) {
                    OrderHistory.belongsTo(models.OrderStatus, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    OrderHistory.belongsTo(models.Order, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return OrderHistory;
};