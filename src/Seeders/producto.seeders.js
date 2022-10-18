const {PRODUCTOS}=require('./productos')
const { crearProducto } = require("../Middleware/crearProducto.middleware")
const {Cell}=require('../db')

const productoSeeder=async()=>{
    const response=await Cell.findAll();
    if(response.length>0){
        console.log("Los Productos ya estan cargados")
    }else{
        PRODUCTOS.map((e)=>{
            crearProducto(e.line, e.model, e.capacity, e.price, e.stock, e.image, e.spec, e.memoryRAM, e.description, e.brand)
        })
        console.log("SeederProducto")
    }
}
module.exports={productoSeeder}