const Notice = require('../model/Notice')
const User = require('../model/User')
const UserNotice = require('../model/UserNotice')
const {nanoid} = require('nanoid')

const NoticeService = {
    getAll: async () => {
        const noticeList = await Notice.findAll()
        return JSON.parse(JSON.stringify(noticeList))
    },
    add: async (obj) => {
        const notice = await Notice.create(obj)
        return JSON.parse(JSON.stringify(notice))
    },
    getByObj: async (obj) => {
        const notice = await Notice.findAll({where: obj})
        return JSON.parse(JSON.stringify(notice))
    },
    getNotcieByProp:async (notice)=>{
        const noticeList = await Notice.findAll({
            where:notice
        })

        return JSON.parse(JSON.stringify(noticeList))
    },
    deleteByProp:async(prop)=>{
        const row = await Notice.destroy({where:prop})
        return JSON.parse(JSON.stringify(row))
    }
}

module.exports = NoticeService