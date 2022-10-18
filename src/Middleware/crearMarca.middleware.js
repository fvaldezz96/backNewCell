const {Brand}=require('../db')


const crearMarca=async(brand)=>{
    let existe = await Brand.findOne({where:{name:brand}})
    if(existe){return existe;}
    else{return await Brand.create({name: brand.toUpperCase()})}

}
module.exports={crearMarca}