const connect = require('../config/sequelize_config')
const {
    Model,
    DataTypes
} = require('sequelize')
const {
    nanoid
} = require('nanoid')

class Permission extends Model {}

Permission.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    class:{
        type:DataTypes.STRING,
        allowNull:false
    },
    className:{
        type:DataTypes.STRING,
        allowNull:false
    },
    // 权限的类型{0：页面权限，1：操作权限，2：数据权限}
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    parentId:DataTypes.STRING
}, {
    sequelize:connect,
    modelName:'Permission',
    tableName:'permission',
    timestamps:false
})

// async function sync(){
//     await Permission.sync({alter:true})
//     console.log('Permission模型与数据库同步完成');
// }

// sync()

module.exports = Permission