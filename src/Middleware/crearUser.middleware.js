const { User, Role } = require("../db")

const crearUser = async (name, email, password, image, location, direction, role) => {
    let existe = await User.findOne({ where: { email: email } })
    if (existe) { console.log(email + " ya existe!"); return { flag: false, message: "ya existe el usuario" } }

    if (!role) {
        role = "Cliente"
    }
    if (email === "valdezfede21@gmail.com") {
        role = "Administrador"
    }
    if (email === "angelobustos01@gmail.com") {
        role = "Administrador"
    }
    if (email === "francoguerra01@gmail.com") {
        role = "Vendedor"
    }
    if (email === "nelsolaciar@gmail.com") {
        role = "Cliente"
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