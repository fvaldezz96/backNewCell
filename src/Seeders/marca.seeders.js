const {Brand}=require('../db')
const {MARCA}=require('./marcas')

async function seederMarcas(){
    const response=await Brand.findAll();
    if(response.length > 0){
        console.log("Marcas ya Cargadas")
    }else{
        Brand.bulkCreate(MARCA);
        console.log("SeederMarcas")
    }
}
module.exports={
    seederMarcas
}
