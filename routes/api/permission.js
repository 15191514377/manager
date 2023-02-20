const router = require('express').Router()
const PermissionService = require('../../service/PermissonService')
const FirstNavSercice = require('../../service/FirstNavSercice')
const multiparty = require('multiparty')
const {nanoid} = require('nanoid')
const { Op } = require('sequelize')

router.get('/getAll',async (req, res) => {
    const list = await PermissionService.getAll()
    res.send(list)
})
router.post('/add',async(req,res)=>{
    const {nav} = req.body
    const data = {err:{code:0,reason:[]},permissionList:[]}
    const conditionList = []
    conditionList.push({class:nav?.nameInEnglish},{className:nav?.name})
    for await(let condition of conditionList){
        const permissionList = await PermissionService.getByObj(condition)
        if(permissionList.length){
            data.err.code = 1
            data.err.reason.every(permission=>permission!==condition)?data.err.reason.push(condition):''
        }
    }
    if(data.err.code===0){
        const permission = await PermissionService.add({
            id:nanoid(),
            type:1,
            class:nav?.nameInEnglish,
            className:nav?.name,
            parentId:null
        })
        Object.keys(permission).length?data.permissionList.push(permission):''
    }
    res.send(data)
})
router.post('/update',async(req,res)=>{
    const fm = new multiparty.Form()
    fm.parse(req,async(err,fields,files)=>{
        if(!err){
            const {type,clz,className,navId} = fields
            let oldPermissionId= ''
            const data = {err:{code:0,reason:[]},permissionList:{}}
            const nav = await FirstNavSercice.find({id:navId[0]})
            if(nav.length){
                const oldPermission =await PermissionService.getByObj({class:nav[0].nameInEnglish})
                if(oldPermission.length===1){
                    oldPermissionId = oldPermission[0].id
                }
            }
            if(oldPermissionId){
                const permissionList = await PermissionService.getByObj({
                        [Op.and]:[{[Op.or]:[{class:clz[0]},{className:className[0]}]},{id:{[Op.ne]:oldPermissionId}}] 
                    })
                if(permissionList.length){
                    data.err.code = 1
                    data.permissionList = permissionList
                    permissionList.forEach(item=>{
                        if(item.class===clz[0]){
                            if(data.err.reason.every(e=>e!=='英文名称')) data.err.reason.push('英文名称')
                        }
                        if(item.className===className[0]){
                            if(data.err.reason.every(e=>e!=='名称')) data.err.reason.push('名称')
                        }
                    })
                }
                if(data.err.code===0){
                    console.log({oldPermissionId});
                    const permission  = await PermissionService.update({class:clz[0],className:className[0]},{id:oldPermissionId})
                    console.log({permission});
                    if(!permission.length){
                        data.err.code = 1
                        data.err.reason = new Array('修改失败')
                    }
                    data.permissionList = permission
                }
            }else{
                data.err.code = 1
                data.err.reason.push('未找到原权限信息')
            }
            res.send(data)
        }
    })
})
router.post('/delete',async(req,res)=>{
    const {permission} = req.body
    const data = {err:{code:1,reason:[]}}
    if(Object.keys(permission).length){
        const condition = []
        Object.keys(permission).forEach(item=>{
            const obj = {}
            obj[`${item}`] = permission[item]
            condition.push(obj)
        })
        const row = await PermissionService.delete({
            [Op.or]:condition
        })
        if(row>1) data.err.code = 0
    }
    res.send(data)
})

module.exports = router