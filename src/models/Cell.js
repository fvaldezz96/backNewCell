const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('cell', {
    line: {type: DataTypes.STRING,allowNull: false,},
    model:{type:DataTypes.STRING, allowNull:false},
    capacity:{ type:DataTypes.INTEGER,allowNull:false},
    price:{ type:DataTypes.FLOAT,allowNull:false},
    stock:{ type:DataTypes.INTEGER},
    image:{type:DataTypes.TEXT,},
    spec:{type:DataTypes.ARRAY(DataTypes.STRING),},
    memoryRAM: {type: DataTypes.INTEGER}, 
    description:{type:DataTypes.TEXT},
    disabled:{type:DataTypes.BOOLEAN, defaultValue: false}
  },{
    timestamps:false
  });
};

