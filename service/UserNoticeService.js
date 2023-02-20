const UserNotice = require('../model/UserNotice')
const {nanoid} = require('nanoid')
const {Op} = require('sequelize')

// todo 添加事务
const UserNoticeService = {
    add: async (userId, noticeId) => {
        const userNotice = await UserNotice.create({
            id: nanoid(),
            userId,
            noticeId,
            isReaded: false
        })
        return JSON.parse(JSON.stringify(userNotice))
    },
    deleteById: async (noticeId) => {
        const userNoticeList = await UserNotice.destroy({
            where: {
                noticeId
            }
        })
        return JSON.parse(JSON.stringify(userNoticeList))
    },
    deleteByUserId: async (userId) => {
        await UserNotice.destroy({
            where: {
                userId
            }
        })
    },
    //根据用户id查询notice
    getNoticeByProp: async (userNotice) => {
        const userNoticeList = await UserNotice.findAll({
            where: userNotice
        })

        return JSON.parse(JSON.stringify(userNoticeList))
    },
    deleteByObj:async(obj)=>{
        const row = await UserNotice.destroy({where:obj})
        return JSON.parse(JSON.stringify(row))
    },
    updateByObj:async(updatedObj,whereObj)=>{
        const row = await UserNotice.update(updatedObj,{where:whereObj})
        return JSON.parse(JSON.stringify(row))
    }
}

module.exports = UserNoticeService