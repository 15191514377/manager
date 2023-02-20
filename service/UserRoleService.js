const UserRole = require('../model/UserRole')

const UserRoleService = {
    deleteByUserId:async (userId)=>{
        const row  = await UserRole.destroy({
            where:{
                uId:userId
            }
        })
    },

    getByObj:async(obj)=>{
        const list = await UserRole.findAll({where:obj})

        return JSON.parse(JSON.stringify(list))
    },
    add:async(obj)=>{
        const row  = await UserRole.create(obj)
        return JSON.parse(JSON.stringify(row))
    },
    deleteByObj:async(obj)=>{
        const row = await UserRole.destroy({
            where:obj
        })
        return JSON.parse(JSON.stringify(row))
    }

}

module.exports = UserRoleService