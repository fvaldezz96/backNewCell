const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
   // defino el modelo
   sequelize.define('rating',
      {
         rating: { type: DataTypes.FLOAT, allowNull: false },
         emailUser: { type: DataTypes.STRING, allowNull: false },
         comment: { type: DataTypes.TEXT },
         date: { type: DataTypes.DATE, allowNull: false }
      });

};