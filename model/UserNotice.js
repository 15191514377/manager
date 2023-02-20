const {Model,DataTypes} = require('sequelize')
const connect = require('../config/sequelize_config')

class UserNotice extends Model{}

UserNotice.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    userId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    noticeId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isReaded:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
},{
    sequelize:connect,
    modelName:'UserNotice',
    tableName:'user_notice',
    timestamps:false,
})

// async function sync(){
//     await UserNotice.sync()
//     console.log('UserNotice模型与数据库同步完成');
// }

// sync()

module.exports = UserNotice