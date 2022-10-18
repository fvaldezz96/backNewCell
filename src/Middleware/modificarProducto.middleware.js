const {Cell}=require('../db')
const {crearMarca}=require('../Middleware/crearMarca.middleware')

const modificarProducto=async(id, line, model, capacity, price, stock, image, spec, memoryRAM, description, brand, disabled)=>{
    let producto= await Cell.findByPk(parseint(id))
    console.log(producto)
    line? producto.line=line:line
   
    model? producto.model=model:model

    capacity? producto.capacity=capacity:capacity

    price?producto.price=parseInt(price):price

    stock?producto.stock=parseInt(stock):stock
   
    image? producto.image=image:image

    spec? producto.spec=spec:spec
    
    memoryRAM? producto.memoryRAM=memoryRAM:memoryRAM
   
    description? producto.description=description:description
   
    disabled? producto.disabled=disabled:disabled
   
    if(brand){
        let mar=await crearMarca(brand)
        await producto.setBrand(mar)
    }
    producto.save()
    return {flag:true, message:"Producto modificado"}

}
module.exports={modificarProducto}