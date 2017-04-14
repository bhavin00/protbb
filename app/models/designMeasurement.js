"use strict";
module.exports = function (sequelize, DataTypes) {
    var DesignMeasurement = sequelize.define("DesignMeasurement", {
       
    }, {
            classMethods: {
                associate: function (models) {
                    DesignMeasurement.belongsTo(models.Design, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });

                    DesignMeasurement.belongsTo(models.Measurement, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );

    return DesignMeasurement;
};