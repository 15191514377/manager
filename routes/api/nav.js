const router = require('express').Router()
const multiparty = require('multiparty')
const firstNavService = require('../../service/FirstNavSercice')
const PermissionService = require('../../service/PermissonService')
const fileUtil = require('../../config/fileUtil')
const sequelize = require('sequelize')
const {nanoid} = require('nanoid')
const connect = require('../../config/sequelize_config')
const FirstNav = require('../../model/FirstNav')
const Permission = require('../../model/Permission')

router.post('/add', async (req, res) => {
    const {nav} = req.body
    console.log({nav});
    const data = {code:0,reason:[]}
    const condition = []
    condition.push({name:nav?.name},{[sequelize.Op.and]:[{index:~~nav?.index},{fatherNavId:nav?.faterBarId?nav?.faterBarId:null}]},{path:nav?.path},{nameInEnglish:nav?.nameInEnglish})
    for await(let item of condition){
        const navList = await firstNavService.findByObj(item)
        if(navList.length){
            data.code = 1
            if(JSON.stringify(item).indexOf('index')){
                data.reason.every(item=>item!==nav?.index)?data.reason.push(nav?.index):''
            }
            Object.keys(item).forEach(key=>{
                const conditionItem = item[key]
                data.reason.every(item=>item!==conditionItem)?data.reason.push(conditionItem):''
            })
        }
    }
    if(data.code===0){
        const navItem = await firstNavService.add({
            id:nanoid(),
            name:nav?.name,
            headIcon:nav?.headIcon,
            createTime:new Date(),
            headIconURI:nav?.headIconURI,
            index:nav?.index?~~nav?.index:null,
            fatherNavId:nav?.faterBarId?nav?.faterBarId:null,
            path:nav?.path,
            nameInEnglish:nav?.nameInEnglish
        })
        if(Object.keys(navItem).length){
            data.code=0
        }
    }
    res.send(data)
})

router.get('/getNavs', async(req, res) => {
    const navList = await firstNavService.getAll()
    console.log(111);
    res.send(navList)
})

router.post('/delete', async (req, res) => {
    const {nav} = req.body
    const data = {code:1,reason:[]}
    if(nav?.id){
        const deleteRow =await firstNavService.delete({
            [sequelize.Op.or]:[{id:nav.id},{fatherNavId:nav.id}]
        })
        if(deleteRow>0){
            data.code = 0
        }
    }
    res.send(data)
})

router.post('/update', async (req, res) => {
    const {nav} = req.body
    const data = {code:0,reason:[]}
    const condition =new Array({name:nav?.name},{[sequelize.Op.and]:[{index:~~nav?.index},{fatherNavId:nav?.faterBarId?nav?.faterBarId:null}]},{path:nav?.path},{nameInEnglish:nav?.nameInEnglish})
    for await(let item of condition){
        const navList = await firstNavService.findByObj({[sequelize.Op.and]:[item,{id:{[sequelize.Op.ne]:nav?.id}}]})
        if(navList.length){
            data.code = 1
            if(JSON.stringify(item).indexOf('index')){
                data.reason.every(item=>item!==nav?.index)?data.reason.push(nav?.index):''
            }
            Object.keys(item).forEach(key=>{
                const conditionItem = item[key]
                data.reason.every(item=>item!==conditionItem)?data.reason.push(conditionItem):''
            })
        }
    }
    if(data.code===0&&nav?.id){
        const updateNav = await firstNavService.update({
            name:nav?.name,
            headIcon:nav?.headIcon,
            createTime:new Date(),
            headIconURI:nav?.headIconURI,
            index:nav?.index?~~nav?.index:null,
            path:nav?.path,
            nameInEnglish:nav?.nameInEnglish
        },nav.id)
        if(!updateNav[0]>0){
            data.code === 1
            data.reason = new Array('更新失败')
        }
    }
    res.send(data)
})
module.exports = router