const connect = require('../config/sequelize_config')
const {
    Model,
    DataTypes
} = require('sequelize');

class FirstNav extends Model {}

FirstNav.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nameInEnglish:DataTypes.STRING,
    path:DataTypes.STRING,
    index:DataTypes.INTEGER,
    fatherNavId:DataTypes.STRING,
    headIcon: {
        type: DataTypes.STRING
    },
    headIconURI: {
        type: DataTypes.STRING
    },
    createTime: {
        type: DataTypes.DATE
    },
}, {
    sequelize: connect,
    modelName: 'FirstNav',
    tableName: 'first_nav',
    //关闭时间戳，不生成createdAt和updatedAt字段
    timestamps:false
})

// async function syncFirstModel(){
//     await FirstNav.sync({alter:true})
//     console.log('FirstNav模型已成功同步');
// }

// syncFirstModel()
module.exports = FirstNav