const router = require('express').Router()
const multiparty = require('multiparty')
const NoticeService = require('../../service/NoticeService')
const UserNoticeService = require('../../service/UserNoticeService')
const UserService = require('../../service/UserService')
const path = require('path')
const fs = require('fs')
const {nanoid} = require('nanoid')

//添加公告信息
router.post('/add', async(req, res) => {
    const data = {err:{code:0,reason:[]},notice:{}}
    const form = new multiparty.Form()
    form.parse(req, async (err, fields,files) => {
        if (!err) {
            const {title,html,editorId,attachment,publishTime} = fields
            const notice={
                id:nanoid(),
                createUser:editorId[0],
                createTime:new Date(),
                noticeContent:html[0],
                noticeFileds:attachment[0],
                isPublish:Boolean(publishTime[0]),
                publishTime:new Date(publishTime[0]),
                noticeTitle:title[0]
            }
            const row = await NoticeService.add(notice)
            if(!row || (row&&!Object.keys(row).length)){
                data.err.code=1
                data.err.reason = new Array('添加失败')
            }else data.notice = row
            res.send(data)
        }
    })
})
//获取所有的公告信息
router.get('/getAll', async (req, res) => {
    const noticeList = await NoticeService.getAll()
    for await(let notice of noticeList){
        const userList = await UserService.getUserByProp({id:notice?.createUser})
        if(userList.length){
            notice.creater = userList[0]?.username
        }
    }
    res.send(noticeList)
})
// 根据id查询公告
router.post('/getNoticeById', async (req, res) => {
    const {id} = req.body
    const data = {err:{code:0,reason:[]},noticeList:{}}
    const noticeList = await NoticeService.getByObj({id})
    if(!noticeList.length){
        data.err.code ===1
        data.err.reason = new Array('未找到公告信息')
    }else{
        data.noticeList = noticeList
    }
    res.send(data)
})
//分配用户
router.post('/assignUsers', async (req, res) => {
    // 获取前端传递的用户ID和公告ID
    const {
        userIdList,
        noticeId
    } = req.body
    // userErrId,userNameList用于保存公告未分配成功的用户的id,name
    const userErrId = []
    const userNameList = []
    //每次添加前删除所有用户与该公告的对应关系
    const rows = await UserNoticeService.deleteById(noticeId)

    for await (userId of userIdList) {
        const userNotice = await UserNoticeService.add(userId, noticeId)
        if (!userNotice) {
            userErrId.push(userId)
        }
    }
    //根据用户id获取用户名
    for await (id of userErrId) {
        const user = await UserService.getUserById(id)
        userNameList.push(user.username)
    }
    if (userNameList.length === 0) {
        res.status(200).send(JSON.stringify({
            err: 0,
            errInfo: '用户分配成功'
        }))
    } else {
        res.status(200).send(JSON.stringify({
            err: 1,
            errInfo: '用户分配失败',
            userNameList
        }))
    }

})
// 查询用户关联的所有公告
router.post('/userNoticeList', async (req, res) => {
    const {userId} = req.body
    const userNoticeList = await UserNoticeService.getNoticeByProp({userId})
    for await (let userNotice of userNoticeList) {
        userNotice.noticeList = await NoticeService.getNotcieByProp({
            id: userNotice.noticeId
        })
        for await(let notice of userNotice.noticeList){
            const user = await UserService.getUserByProp({id:notice.createUser})
            notice.createUsername = user.length?user[0].username:''
        }
    }
    res.send(JSON.stringify(userNoticeList))
})
//根据noticeId查询用户信息
router.post('/getUserListByNoticeId',async(req,res)=>{
    const {noticeId} = req.body
    const userList = []
    const userNoticeList =await UserNoticeService.getNoticeByProp({noticeId:noticeId})
    for await(let userNotice of userNoticeList){
        const user =await UserService.getUserByProp({id:userNotice.userId})
        if(user.length){
            user.forEach(e=>{
                if(userList.every(item=>item.id!==e.id)) userList.push(e)
            })
        }
    }
    res.send(userList)
})
router.post('/alloctUser',async(req,res)=>{
    const {userIdList,noticeId} = req.body
    const data = {err:{code:0,reason:[]}}
    if(userIdList.length&&noticeId){
        for await(let userId of userIdList){
            const userNoticeList = await UserNoticeService.getNoticeByProp({userId,noticeId})
            if(!userNoticeList.length){
                const row = await UserNoticeService.add(userId,noticeId)
                if(!Object.keys(row).length){
                    data.err.code=1
                    const user = await UserService.getUserByProp({id:userId})
                    (user.length&&data.err.reason.every(item=>item?.id!==user[0]?.id)) ? data.err.reason.push(user[0]):""
                }
            }else{
                const row = await UserNoticeService.deleteByObj({userId,noticeId})
                if(row<1){
                    data.err.code =1
                    const user = await UserService.getUserByProp({id:userId})
                    (user.length&&data.err.reason.every(item=>item?.id!==user[0]?.id)) ? data.err.reason.push(user[0]):""
                }
            }
        }
    }
    res.send(data)
})
router.post('/search',async(req,res)=>{
    const {notice} = req.body
    console.log({notice});
    const data = {err:{code:1,reason:[]},noticeList:{}}
    if(Object.keys(notice).length){
        const noticeList =await NoticeService.getByObj(notice)
        if(noticeList.length){
            data.err.code=0
            data.noticeList = noticeList
        }
    }
    res.send(data)
})
router.post('/delete',async(req,res)=>{
    const {notice} = req.body
    const data  = {err:{code:0,reason:[]}}
    const row = await NoticeService.deleteByProp(notice)
    if(row<1){
        data.err.code = 1
    }
    res.send(data)
})
router.post('/getNoticeUserList',async(req,res)=>{
    const {notice} = req.body
    const data = {err:{code:0,reason:[]},userList:[]}
    if(Object.keys(notice).length){
        if(notice?.id){
            const userNoticeList = await UserNoticeService.getNoticeByProp({noticeId:notice.id})
            if(userNoticeList.length){
                for await (let userNotice of userNoticeList){
                    const user = await UserService.getUserByProp({id:userNotice?.userId})
                    if(user.length){
                        user.forEach(item=>{
                            if(!data.userList.length) data.userList.push(item)
                            else {
                                if(data.userList.every(e=>e?.id!==item.id)) data.userList.push(item)
                            }
                        })
                    }
                }
            }
        }
    }
    res.send(data)
})
router.post('/updateUserNotice',async(req,res)=>{
    const {userNotice} = req.body
    userNotice.userId&&userNotice.noticeId&&UserNoticeService.updateByObj({isReaded:true},{userId:userNotice.userId,noticeId:userNotice.noticeId})
})
module.exports = router