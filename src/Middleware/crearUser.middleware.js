const { User, Role } = require("../db")

const crearUser = async (name, email, password, image, location, direction, role) => {
    let existe = await User.findOne({ where: { email: email } })
    if (existe) { console.log(email + " ya existe!"); return { flag: false, message: "ya existe el usuario" } }

    if (!role) {
        role = "Cliente"
    }
    if(email==="nahirarroyo99@gmail.com"){
        role="Administrador"
    }
    if (email === "asanchezdelaf2@gmail.com") {
        role = "Administrador"
    }
    if (email === "valdezfede21@gmail.com") {
        role = "Administrador"
    }
  

    let rol = await Role.findOne({ where: { name: role } })

    let user = await User.create({
        name: name,
        email: email,
        password: password,
        image: image,
        location: location,
        direction: direction,
        disabled: false
    })

    await user.setRole(rol);
    user.save();
    return { flag: true, message: "Usuario creado" }
}
module.exports = { crearUser }