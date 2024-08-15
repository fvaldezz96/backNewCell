
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { seederMarcas } = require('./src/Seeders/marca.seeders')
const { seederRole } = require('./src/Seeders/role.seeders')
const { productoSeeder } = require('./src/Seeders/producto.seeders')
// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(3001, () => {
    console.log('%s listening at 3001');
    seederMarcas();
    productoSeeder();
    seederRole();
  });
});
