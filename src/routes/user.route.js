const {Router}=require('express')
const {obtenerUsers,obtenerUserById, obtenerUsersAdmin}=require('../Middleware/getUser.middleware')
const {crearUser}=require('../Middleware/crearUser.middleware')

const {User, Role}=require("../db")


const router=Router();

router.get('/', async(req,res,next)=>{
    try{
        let users = await obtenerUsers()
        users.length>0?
        res.send(users):res.send({message:"No users"})
    }
    catch(error){next(error); console.log(error)}
})

router.get('/id/:id', async(req,res,next)=>{
    let {id}=req.params
    try{
        let user = await obtenerUserById(id)
        return res.send(user)
    }
    catch(error){next(error); console.log(error)}
})

router.post('/',async(req,res,next)=>{
    let {name, email, password, image, location, direction, role }=req.body
    try{
        let userCreado=await crearUser(name, email, password, image, location, direction, role)
        userCreado.flag? res.send(userCreado.message)
        :res.send(userCreado.message)
    }
    catch(error){next(error)}
})

router.put('/:id',async(req,res,next)=>{
    let {name, email, password, image, location, direction, role, disabled }=req.body
    let {id}=req.params;
      
      try{
          await User.update(
            {name, email, password, image, location, direction, role, disabled },
            {where: {id}}
          )
  
          if(role){
            let rol = await Role.findOne({where: {name:role}})
            let user = await User.findByPk(id)
            
            await user.setRole(rol)
            user.save();
          }
  
          return res.status(200).json("User updated")
  
      }
      catch(error){next(error)}
  })


  router.get('/admin', async(req,res,next)=>{

        const filters = req.query;
        let condition = {}
      
        try {
          if (Object.keys(filters).length === 0) {
            const users = await obtenerUsersAdmin();
            return res.send(users)
          }
      
          for (key in filters) {
            if (key === "capacity" || key === "price") {
              let [min, max] = filters[key].split("/");
              condition[key] = { [Op.between]: [min, max] }
            } else {
              if (key === "role") { continue }
              condition[key] = filters[key]
            }
          }
          let users = await User.findAll({include:[{model:Role}], where: condition})
          if (filters.role) {
            users = users.filter(e => e.role.name === filters.role)
          }
          users = users.map((e) => {
            return {
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
          })
          return res.send(users)
        }
        catch (error) { next(error.message); console.log(error.message) }
    })


router.get('/getByEmail/:email', async (req, res)=>{
    const {email} = req.params
    try {
        if(!email){ return res.status(406).send("email is required")}

        let user = await User.findOne({where:{email: email}})
        res.status(200).send(user)
    } catch (error) {
        res.send(error)
        console.log(error);
    }
})



module.exports=router;