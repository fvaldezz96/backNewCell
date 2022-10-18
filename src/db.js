require('dotenv').config();
const { Sequelize, Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/productos`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Cell, Brand, User, Order, Role, Question, Rating } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Cell.belongsTo(Brand);
Brand.hasMany(Cell);

// User.belongsToMany(Order, {through: 'user_order'});
// Order.belongsToMany(User, {through: 'user_order'});

User.belongsToMany(Cell, { through: 'userCell' });
Cell.belongsToMany(User, { through: 'userCell' });
Order.belongsTo(User);
//FALTA IMPORTAR ORDERS
Order.belongsToMany(Cell, { through: 'orderCell' });
Cell.belongsToMany(Order, { through: 'orderCell' });

User.belongsTo(Role);
Role.hasMany(User);

// Rating.belongsTo(User);

Question.belongsTo(Cell);
Cell.hasMany(Question);

Rating.belongsTo(Cell);
Cell.hasMany(Rating);

User.belongsToMany(Cell, { through: 'userCart', as: 'cart', timestamps: false })
Cell.belongsToMany(User, { through: 'userCart', as: 'cart', timestamps: false })


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
  Op,
  Brand, Cell, User, Role, Question, Order, Rating
};
