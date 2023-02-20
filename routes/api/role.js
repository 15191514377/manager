const router = require('express').Router()
const RoleService = require('../../service/RoleService')
const UserRoleService = require('../../service/UserRoleService')
const RolePermissionService = require('../../service/RolePermissionService')
const RoleNavService = require('../../service/RoleNavService')
const UserService = require('../../service/UserService')
const PermissionService = require('../../service/PermissonService')
const FirstNavSercice = require('../../service/FirstNavSercice')
const {
    nanoid
} = require('nanoid')

// 获取所有角色信息
router.get('/getAll', async (req, res) => {
    const roleList = await RoleService.getAll()
    res.send(JSON.stringify(roleList))
})

router.post('/add', async (req, res) => {
    const {
        roleName
    } = req.body
    const addRoleInfo = await RoleService.add(roleName)
    res.send(addRoleInfo)
})

router.post('/delete', async (req, res) => {
    const {
        id
    } = req.body
    const resData = await RoleService.delete(id)
    res.send(resData)
})

router.post('/update', async (req, res) => {
    const {
        name,
        id
    } = req.body
    const resData = await RoleService.update(name, id)
    res.send(resData)
})
// 通过名称获取角色
router.post('/getRole', async (req, res) => {
    const role = req.body
    const roleList = await RoleService.getRoleByName(role)
    res.send(JSON.stringify(roleList))
})
//获取角色关联的用户和权限
router.post('/getUserAndPermission', async (req, res) => {
    const {role} = req.body
    const data = {userList: [],permissionList: [],navList:[]}

    const userRoleList = await UserRoleService.getByObj({rId: role.id})
    for await(let userRole of userRoleList){
        const userList = await UserService.getUserByProp({id:userRole?.uId})
        userList.forEach(user=>{
            data.userList.every(e=>e?.id!==user?.id)?data.userList.push(user):''
        })
    }

    const rolePermissionList = await RolePermissionService.getByObj({rId: role.id})
    for await(let rolePermission of rolePermissionList){
        const permissionList = await PermissionService.getByObj({id:rolePermission?.pId}) 
        permissionList.forEach(permission=>{
            data.permissionList.every(e=>e?.id!==permission?.id)?data.permissionList.push(permission):''
        })
    }

    const roleNavList = await RoleNavService.getByObj({roleId:role?.id})
    for await(let roleNav of roleNavList){
        const navList = await FirstNavSercice.findByObj({id:roleNav?.navId})
        navList.forEach(navItem=>{
            data.navList.every(e=>e?.id!==navItem?.id)?data.navList.push(navItem):''
        })
    }
    
    res.send(data)
})
//为角色分配用户
router.post('/allocatUser', async (req, res) => {
    const data ={code:0,reason:[]}
    const {userList,role} = req.body
    console.log('userList',userList);
    const userIdList = userList.map(e=>e?.id)
    for await(let userId of userIdList){
        const findUserList = await UserRoleService.getByObj({uId:userId,rId:role?.id})
        const user = userList.filter(e=>e?.id===userId)[0]
        if(findUserList.length){
            const deleteRow = await UserRoleService.deleteByObj({uId:userId,rId:role?.id})
            if(!deleteRow>0){
                data.code = 1
                data.reason.every(e=>e!==user?.username)?data.reason.push(user.username):''
            }
        }else{
            const createItem = await UserRoleService.add({id:nanoid(),uId:userId,rId:role?.id})
            if(!Object.keys(createItem).length){
                data.code = 1
                data.reason.every(e=>e!==user?.username)?data.reason.push(user.username):''
            }
        }
    }
    res.send(data)
})
//为角色分配权限
router.post('/allotPermission',async (req,res)=>{
    const {role,permissionList} = req.body
    const data = []
    for await (let permission of permissionList){
        const item = {err:0,id:permission.id, name:permission.className}
        const findRow = await RolePermissionService.getByObj({pId:permission.id,rId:role.id})
        if(!findRow.length){
            const createRow = await RolePermissionService.add({id:nanoid(),pId:permission.id,rId:role.id})
            if(!createRow) item.err = 1
        }else{
            const deleteRow = await RolePermissionService.deleteByObj({pId:permission.id,rId:role.id})
            if(!deleteRow||deleteRow.length<1) item.err = 1
        }
        data.push(item)
    }
    res.send(data)
})

router.post('/allotNav',async(req,res)=>{
    const {diffNavList,roleId} = req.body
    const navIdList = diffNavList.map(e=>e?.id)
    const data={code:0,reason:[]}
    if(roleId&&navIdList.length){
        for await(let navId of navIdList){
            const roleNavList = await RoleNavService.getByObj({roleId,navId})
            const nav = diffNavList.filter(e=>e?.id===navId)
            if(roleNavList.length){
                const deleteRow = await RoleNavService.deleteByObj({roleId,navId})
                if(deleteRow<1){
                    data.code=1
                    data.reason.every(e=>e!==nav?.name)?data.reason.push(nav.name):''
                }
            }else{
                const creatList = await RoleNavService.addByObj({id:nanoid(),roleId,navId})
                if(!Object.keys(creatList).length){
                    data.code=1
                    data.reason.every(e=>e!==nav?.name)?data.reason.push(nav.name):''
                }
            }
        }
    }else{
        data.code=1
        data.reason = new Array('更新失败')
    }
    res.send(data)
})


module.exports = router