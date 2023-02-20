const {Model,DataTypes} = require('sequelize')
const connect = require('../config/sequelize_config')

class Notice extends Model{}

Notice.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    createUser:DataTypes.STRING,
    createTime:DataTypes.DATE,
    // 公告发布时间，如果没有设置值，则默认为立即发布
    publishTime:DataTypes.DATE,
    noticeTitle:DataTypes.STRING,
    noticeContent:DataTypes.TEXT,
    noticeFileds:DataTypes.TEXT,
    // 是否发布
    isPublish:DataTypes.BOOLEAN
},{
    sequelize:connect,
    modelName:'Notice',
    tableName:'notice',
    timestamps:false
})

// async function sync(){
//     await Notice.sync({alter:true})
//     console.log('Notice模型与数据库同步完成');
// }

// sync()

module.exports = Notice