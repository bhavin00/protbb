"use strict";
module.exports = function (sequelize, DataTypes) {
    var Material = sequelize.define("Material", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Material type must be unique.'
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
                }
            }
        }
     //,{
     //   indexes: [
     //       // Create a unique index title
     //       {
     //           unique: true,
     //           fields: ['title']
     // }]}
    );

    return Material;
};