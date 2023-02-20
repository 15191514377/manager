const User = require("../model/User")
const Role = require('../model/Role')
const UserRole = require('../model/UserRole')
const Login = require('../model/Login')

const {Op,where} = require("sequelize")

User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'uId',
    otherKey: 'rId'
})

User.hasMany(Login, {
    foreignKey: 'userId',
})

Login.belongsTo(User, {
    otherKey: 'userId'
})

const UserService = {
    getAll: async () => {
        const userList = await User.findAll({
            include: [Role, Login]
        })
        return JSON.parse(JSON.stringify(userList))
    },
    getAllWithNothing: async () => {
        const userList = await User.findAll()
        return JSON.parse(JSON.stringify(userList))
    },
    deleteByObj: async (obj) => {
        const row = await User.destroy({
            where: obj
        })
        return JSON.parse(JSON.stringify(row))
    },
    getUserByNameOrId: async (value) => {
        const userList = await User.findAll({
            include: Role,
            where: {
                [Op.or]: {
                    username: value,
                    userId: value
                }
            }
        })

        return JSON.parse(JSON.stringify(userList))
    },
    getUserById: async (id) => {
        const user = await User.findOne({
            include: [Role, Login],
            where: {
                id
            }
        })
        return JSON.parse(JSON.stringify(user))
    },
    getUserByIdAndPwd: async (userId, password) => {
        const user = await User.findOne({
            where: {
                [Op.and]: [{
                    userId,
                    password
                }]
            }
        })
        return JSON.parse(JSON.stringify(user))
    },
    //冻结或解冻用户
    updateByObj: async (obj,id) => {
        const user = await User.update(obj, {
            where: {id}
        })
        return JSON.parse(JSON.stringify(user))
    },
    //添加用户
    add: async (user) => {
        const result = await User.create(user)
        return JSON.parse(JSON.stringify(result))
    },
    //通过用户属性查询
    getUserByProp: async (obj) => {
        const userList =await User.findAll({where: obj})
        return JSON.parse(JSON.stringify(userList))
    }
}


module.exports = UserService