const {Model,DataTypes} = require('sequelize')
const connect = require('../config/sequelize_config')

class Login extends Model{}

Login.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    userId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    loginTime:{
        type:DataTypes.DATE,
        allowNull:false
    },
    signOutTime:DataTypes.DATE,
    //登录ip
    host:DataTypes.STRING,
    //登录地点
    loginAddress:DataTypes.STRING
},{
    sequelize:connect,
    modelName:'Login',
    tableName:'login',
    timestamps:false
})

// async function sync(){
//     await Login.sync({alter:true})
// }

// sync()

module.exports = Login