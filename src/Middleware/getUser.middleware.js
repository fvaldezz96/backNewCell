const {User, Role}=require('../db')

const obtenerUsers=async()=>{
    let users=await User.findAll({where: { disabled: false }, include:[{model:Role}]});
    console.log(users)
    let toObj=[]
    users?.map((e)=>{
        toObj.push({
            id: e.id,
            name: e.name,
            email: e.email,
            password: e.password,
            image: e.image,
            location: e.location,
            direction: e.direction,
            disabled: e.disabled,
            role: e.role.name
        })
    })
    return toObj;
}
const obtenerUserById=async(id)=>{
    let e= await User.findByPk(id, {include:[{model:Role}]})
    const user={
        id: e.id,
        name: e.name,
        email: e.email,
        password: e.password,
        image: e.image,
        location: e.location,
        direction: e.direction,
        disabled: e.disabled,
        role: e.role.name
    }
    return user
}

const obtenerUsersAdmin=async()=>{
    let users=await User.findAll({include:[{model:Role}]});
    console.log(users)
    let toObj=[]
    users?.map((e)=>{
        toObj.push({
            id: e.id,
            name: e.name,
            email: e.email,
            password: e.password,
            image: e.image,
            location: e.location,
            direction: e.direction,
            disabled: e.disabled,
            role: e.role.name
        })
    })
    return toObj;
}
module.exports={obtenerUsers,obtenerUserById, obtenerUsersAdmin}