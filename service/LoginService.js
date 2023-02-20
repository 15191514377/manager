const Login = require('../model/Login')
const {
    nanoid
} = require('nanoid')

const LoginService = {
    add: async (obj) => {
        const login = await Login.create(obj)
        return JSON.parse(JSON.stringify(login))
    },
    getUserLoginLatest: async (userId) => {
        const login = await Login.findAll({
            where: {
                userId
            },
            order: [
                ['loginTime', 'DESC']
            ],
            limit: 1
        })

        return JSON.parse(JSON.stringify(login))[0]
    },
    updateByObj:async (updateObj,whereObj)=>{
        const login = await Login.update(updateObj,{
            where:whereObj
        })
        return JSON.parse(JSON.stringify(login))
    },
    deleteByUserId:async (userId)=>{
        const row = Login.destroy({
            where:{
                userId
            }
        })

        return JSON.parse(JSON.stringify(row))
    },
    getByObj:async(obj)=>{
        const loginList = await Login.findAll({
            where:obj
        })
        return JSON.parse(JSON.stringify(loginList))
    }
}

module.exports = LoginService