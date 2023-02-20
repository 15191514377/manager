const connect = require('../config/sequelize_config')
const {Model,DataTypes} = require('sequelize')
const {nanoid} = require('nanoid')

class UserRole extends Model{}

UserRole.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:nanoid()
    },
    uId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rId:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize:connect,
    modelName:'UserRole',
    tableName:'use_role',
    timestamps:false
})

// async function sync(){
//     await UserRole.sync()
//     console.log('UserRole模型与数据库同步完成');
// }

// sync()

module.exports = UserRole
