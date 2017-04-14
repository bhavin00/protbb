"use strict";
module.exports = function (sequelize, DataTypes) {
    var Design = sequelize.define("Design", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Design must be unique.'
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
            classMethods: {
                associate: function (models) {
                    Design.hasMany(models.DesignMeasurement)
                }
            }
        }
    );

    return Design;
};