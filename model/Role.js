const connect = require('../config/sequelize_config')
const {Model,DataTypes}  = require('sequelize')
const {nanoid} = require('nanoid')

class Role extends Model{}

Role.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    type:{
        type:DataTypes.STRING
    }
},{
    sequelize:connect,
    modelName:'Role',
    tableName:'role',
    timestamps:false
})

// async function sync(){
//     await Role.sync()
//     console.log('Role模型与数据库同步完成');
// }

// sync()

module.exports = Role