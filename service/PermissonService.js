const {
    Op
} = require('sequelize')
const Permission = require('../model/Permission')

const PermissionService = {
    getAll: async (obj) => {
        const list = await Permission.findAll({
            where: {
                [Op.and]: [{parentId: {[Op.eq]: null}}, obj]
            }
        })
        const parseList = JSON.parse(JSON.stringify(list))
        for await (let item of parseList) {
            const children = await Permission.findAll({
                where: {
                    [Op.and]: [{parentId: {[Op.eq]: item.id}}, obj]
                }
            })
            item.children = JSON.parse(JSON.stringify(children))
        }
        return parseList
    },
    getByObj:async (obj) =>{
        const list  = await Permission.findAll({
            where:obj
        })
        return JSON.parse(JSON.stringify(list))
    },
    add:async (nav)=>{
        const navList = await Permission.create(nav)
        return JSON.parse(JSON.stringify(navList))
    },
    update:async(obj,id)=>{
        const permission = await Permission.update(obj,{where:id})
        return JSON.parse(JSON.stringify(permission))
    },
    delete:async(obj)=>{
        const row = await Permission.destroy({
            where:obj
        })
        return JSON.parse(JSON.stringify(row))
    }
}

module.exports = PermissionService