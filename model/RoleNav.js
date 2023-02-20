const connect = require('../config/sequelize_config')
const {Model,DataTypes} = require('sequelize');

class RoleNav extends Model {}

RoleNav.init({
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    roleId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    navId: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: connect,
    modelName: 'RoleNav',
    tableName: 'role_nav',
    //关闭时间戳，不生成createdAt和updatedAt字段
    timestamps:false
})

// async function syncFirstModel(){
//     await RoleNav.sync()
//     console.log('RoleNav模型已成功同步');
// }

// syncFirstModel()
module.exports = RoleNav