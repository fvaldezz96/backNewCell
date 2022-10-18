const {DataTypes} =require('sequelize')
module.exports=(sequelize)=>{
    sequelize.define('brand',{
        name:{type:DataTypes.STRING, unique:true},
    },{
        timestamps:false
    });
};