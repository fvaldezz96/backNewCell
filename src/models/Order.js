
const {DataTypes} =require('sequelize')

module.exports=(sequelize)=>{
    sequelize.define('order',{
        id_Orders:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false
        },
        userMail: {
            type: DataTypes.STRING,
            allowNull:false
        },
        date:{
            type:DataTypes.DATEONLY,
            allowNull:false,
            defaultValue: new Date()
        },
        payment:{
            type:DataTypes.STRING,
            allowNull:false
        },
        subTotal:{
            type:DataTypes.STRING,
            // allowNull:false
        },
        paid:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        },
        // name:{type:DataTypes.STRING, allowNull: false},
        // date:{type: DataTypes.DATEONLY},
        status:{type: DataTypes.STRING, defaultValue: 'Pendiente'}
    },{
        timestamps:false
    });
};