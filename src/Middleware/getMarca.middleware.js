const {Brand}=require('../db');


const obtenerMarcas=async()=>{
    let brands=await Brand.findAll()
    let toObj=[]
    brands?.map((e)=>{
        toObj.push(e.name)
    })
    return toObj;
}
module.exports={obtenerMarcas}