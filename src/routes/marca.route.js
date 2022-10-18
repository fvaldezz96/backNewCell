const {Router}= require('express')
const {obtenerMarcas}=require('../Middleware/getMarca.middleware')
const {crearMarca}=require('../Middleware/crearMarca.middleware')
const router=Router()

router.get('/', async(req,res,next)=>{
    try{
        let brands=await obtenerMarcas()
        res.send(brands)
    }
    catch(error){next(error)}
})
router.post('/', async(req,res,next)=>{
    let {brands}=req.body
    try{
        let brand = await crearMarca(brands)
        brand? res.send("Marca "+brands+" agregado con exito"):res.send("Problema al agregar la marca")
    }
    catch(error){next(error)}
})
module.exports=router