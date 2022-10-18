const {Cell}=require("../db")
const {crearMarca}=require('../Middleware/crearMarca.middleware')

const crearProducto = async (line, model, capacity, price, stock, image, spec, memoryRAM, description, brand, disabled)=>{
    let mar=await crearMarca(brand)
    let existe=await Cell.findOne({where:{line:line, model:model, capacity:capacity, description:description  }})
    if (existe){console.log(line+" "+model+" ya existe!");return {flag: false, message:"ya existe el producto"}}
    let product=await Cell.create({
        line:line,
        model:model,
        capacity:capacity,
        price:price,
        stock:stock,
        image:image,
        spec:spec,
        memoryRAM: memoryRAM,
        description:description,
        disabled: false
    })
    await product.setBrand(mar)
    product.save();
    return{flag:true,message:"Producto creado"}
}
module.exports={crearProducto}