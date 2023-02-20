const RoleNav = require('../model/RoleNav')
const {nanoid} = require("nanoid")
const RoleNavService = {
    getByObj:async(obj)=>{
        const roleNavList = await RoleNav.findAll({where:obj})
        return JSON.parse(JSON.stringify(roleNavList))
    },
    deleteByObj:async(obj)=>{
        const deletRow = await RoleNav.destroy({
            where:obj
        })
        return JSON.parse(JSON.stringify(deletRow))
    },
    addByObj:async(obj)=>{
        const creatList = await RoleNav.create(obj)
        return JSON.parse(JSON.stringify(creatList))
    }
}

module.exports = RoleNavService