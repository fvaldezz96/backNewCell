const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('product', {
    code: { type: DataTypes.STRING, allowNull: false },
    line: { type: DataTypes.STRING, allowNull: false, },
    name: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER },
    amount: { type: DataTypes.INTEGER },
    color: { type: DataTypes.STRING },
    image: { type: DataTypes.TEXT, },
    spec: { type: DataTypes.ARRAY(DataTypes.STRING), },
    memoryRAM: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    disabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    customData: { type: DataTypes.JSON },
    cost: { type: DataTypes.FLOAT },
    size: { type: DataTypes.STRING },
  }, {
    timestamps: false
  });
};



