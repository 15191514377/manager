const RolePermission  = require('../model/RolePermission')

const RolePermissionService = {
    getByObj: async(obj)=>{
        const list  = await RolePermission.findAll({
            where:obj
        })

        return JSON.parse(JSON.stringify(list))
    },
    add:async(obj)=>{
        const list  = await RolePermission.create(obj)
        return JSON.parse(JSON.stringify(list))
    },
    deleteByObj:async (obj)=>{
        const list = await RolePermission.destroy({
            where:obj
        })
        return JSON.parse(JSON.stringify(list))
    }
}

module.exports = RolePermissionService