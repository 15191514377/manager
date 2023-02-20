const connect = require('../config/sequelize_config')
const {Model,DataTypes} = require('sequelize')
const {nanoid} = require('nanoid')

class RolePermission extends Model{}

RolePermission.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
    },
    rId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    pId:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize:connect,
    modelName:'RolePermission',
    tableName:'role_permission',
    timestamps:false
})

// async function sync(){
//     await RolePermission.sync()
//     console.log('RolePermission模型与数据库同步完成');
// }

// sync()

module.exports = RolePermission
