const {Role} =  require ("../db");
const {ROLES} = require('./roles');

async function seederRole() {

  const response = await Role.findAll();

  if (response.length > 0) {
    console.log("Roles ya creados");
  } else {
    Role.bulkCreate(ROLES);
    console.log("SeederRoles")
  }

}

module.exports = {
    seederRole
}