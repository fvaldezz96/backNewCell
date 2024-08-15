// require('dotenv').config();
const { Sequelize, Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://postgres:clave123@localhost/trozadero_db`, {
  logging: false,
  native: false,
});
// console.log(sequelize, 'sequelize')
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });
// debu
// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Product, Brand, User, Order, Role, Question, Rating } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Product.belongsTo(Brand);
Brand.hasMany(Product);

User.belongsToMany(Order, { through: 'user_order' });
Order.belongsToMany(User, { through: 'user_order' });

User.belongsToMany(Product, { through: 'userProduct' });
Product.belongsToMany(User, { through: 'userProduct' });
Order.belongsTo(User);
//FALTA IMPORTAR ORDERS
Order.belongsToMany(Product, { through: 'orderProduct' });
Product.belongsToMany(Order, { through: 'orderProduct' });

User.belongsTo(Role);
Role.hasMany(User);

// Rating.belongsTo(User);

Question.belongsTo(Product);
Product.hasMany(Question);

Rating.belongsTo(Product);
Product.hasMany(Rating);

User.belongsToMany(Product, { through: 'userCart', as: 'cart', timestamps: false })
Product.belongsToMany(User, { through: 'userCart', as: 'cart', timestamps: false })


module.exports = {
  ...sequelize.models, 
  conn: sequelize,    
  Op,
  Brand, Product, User, Role, Question, Order, Rating
};
