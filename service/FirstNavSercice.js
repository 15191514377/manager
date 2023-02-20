const FirstNav = require('../model/FirstNav')
const {nanoid} = require('nanoid')

const parse_file = require('../routes/file')
const { Op } = require('sequelize')

const firstNavService = {
    getAll: async () => {
        const firstNavList = await FirstNav.findAll({
            where:{fatherNavId:{
                [Op.eq]:null
            }}
        })
        const firstList = JSON.parse(JSON.stringify(firstNavList))
        for await(let item of firstList){
            const secondNavList = await FirstNav.findAll({
                where:{
                    fatherNavId:{
                        [Op.eq]:item.id
                    }
                }
            })
            item.seconds = JSON.parse(JSON.stringify(secondNavList))
        }

        return firstList;
    },

    findByObj:async (obj)=>{
        const firstList = await FirstNav.findAll({
            where:obj
        })

        return JSON.parse(JSON.stringify(firstList))
    },

    add: async(first)=>{
        const row = await FirstNav.create(first)
        return JSON.parse(JSON.stringify(row))
    },

    delete:async(obj)=>{
        const row = await FirstNav.destroy({
            where:obj
        })

        return JSON.parse(JSON.stringify(row))
    },

    update: async(obj,id)=>{
        const row = await FirstNav.update(obj,{
            where:{id}
        })
        return JSON.parse(JSON.stringify(row))
    }
}

module.exports = firstNavService