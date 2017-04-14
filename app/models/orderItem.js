"use strict";
module.exports = function (sequelize, DataTypes) {
    var OrderItem = sequelize.define("OrderItem", {
        colorCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        customization: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pair: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        stitchingDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        alertDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        completeDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        cancelDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    }, {
            classMethods: {
                associate: function (models) {
                    OrderItem.hasMany(models.OrderItemMeasurement);

                    OrderItem.belongsTo(models.Design, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    OrderItem.belongsTo(models.Order, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    OrderItem.belongsTo(models.OrderStatus, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    OrderItem.belongsTo(models.Style, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    OrderItem.belongsTo(models.Material, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: true
                        }
                    });
                }
            }
        }
    );

    return OrderItem;
};