const Role = require('../model/Role')
const Permission = require('../model/Permission')
const RolePermission = require('../model/RolePermission')
const {
    nanoid
} = require('nanoid')
const UserRole = require('../model/UserRole')

Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'rId',
    otherKey: 'rId'
})

const RoleService = {
    getAll: async () => {
        const roleList = await Role.findAll({
            include: Permission
        })
        return JSON.parse(JSON.stringify(roleList))
    },

    add: async (name) => {
        const oneRole = await Role.findAll({
            where: {
                name
            },
            limit: 1
        })
        const oneRolePares = JSON.parse(JSON.stringify(oneRole))

        if (Object.keys(oneRolePares).length === 0) {
            const role = await Role.create({
                id: nanoid(),
                name
            })
            const rolePares = JSON.parse(JSON.stringify(role))
            console.log('rolePares', rolePares);
            if (Object.keys(rolePares).length === 0) {
                return JSON.stringify({
                    err: 1,
                    errInfo: '用户未创建成功',
                    data: null
                })
            } else {
                return JSON.stringify({
                    err: 0,
                    errInfo: '用户创建成功',
                    data: rolePares
                })
            }
        } else {
            return JSON.stringify({
                err: 1,
                errInfo: '用户名已存在',
                data: null
            })
        }


    },

    delete: async (id) => {
        //删除角色相关信息
        const role = await Role.destroy({
            where: {
                id
            }
        })
        if (role === 0) {
            return JSON.stringify({
                err: 1,
                errInfo: '删除失败，表中不存在该项记录'
            })
        } else {
            // 删除角色用户表以及角色权限表中相关数据
            const userRoleRows = await UserRole.destroy({
                where: {
                    rId: id
                }
            })
            const RolePermissionRows = await RolePermission.destroy({
                where: {
                    rId: id
                }
            })
            return JSON.stringify({
                err: 0,
                errInfo: '删除成功'
            })
        }
    },

    update: async (name, id) => {
        const rows = await Role.update({
            name
        }, {
            where: {
                id
            }
        })

        if (rows[0] === 0) {
            return JSON.stringify({
                err: 1,
                errInfo: '修改数据失败，表中没有对应数据'
            })
        } else {
            return JSON.stringify({
                err: 0,
                errInfo: '修改数据成功'
            })
        }
    },
    //通过属性获取角色
    getRoleByName: async (obj) => {
        const roleList = await Role.findAll({
            where: obj
        })
        return JSON.parse(JSON.stringify(roleList))
    },
    getByObj:async(obj)=>{
        const list = await Role.findAll({where:obj})
        return JSON.parse(JSON.stringify(list))
    }
}

module.exports = RoleService