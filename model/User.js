const connect = require('../config/sequelize_config')
const {Model,DataTypes}  = require('sequelize')
const {nanoid} = require('nanoid')

class User extends Model{}

User.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        defaultValue:nanoid()
    },
    userId:{
        type:DataTypes.BIGINT(8),
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    avatar:{
        type:DataTypes.STRING,
    },
    phone:{
        type:DataTypes.BIGINT(11)
    },
    email:{
        type:DataTypes.STRING(50)
    },
    sex:{
        // 0:男；1:女
        type:DataTypes.INTEGER(1),
        default:new Date()
    },
    createTime:{
        type:DataTypes.DATE,
    },
    isFreezed:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    sequelize:connect,
    modelName:'User',
    tableName:'User',
    timestamps:false
})

// async function sync(){
//     await User.sync({alter:true})
//     console.log('User模型与数据库同步完成');
// }

// sync()

module.exports = User