var express = require('express');
var router = express.Router();
const UserService = require('../../service/UserService')
const LoginService = require('../../service/LoginService')
const UserRoleService = require('../../service/UserRoleService')
const UserNoticeService = require('../../service/UserNoticeService')
const RolePermissionService = require('../../service/RolePermissionService')
const RoleService = require('../../service/RoleService')
const PermissionService = require('../../service/PermissonService')
const FirstNavService = require('../../service/FirstNavSercice')
const JWT = require('../../config/jwt')
const fileUtil = require('../../config/fileUtil')
const multiparty = require('multiparty')
const path = require('path');
const User = require('../../model/User');
const { Op } = require('sequelize');
const RoleNavService = require('../../service/RoleNavService');
const { nanoid } = require('nanoid');

// 获取用户信息及对应的角色信息
router.get('/getUsers', async (req, res) => {
  const userList = await UserService.getAll()
  for await (user of userList) {
    user?.id?user.latestLogin = await LoginService.getUserLoginLatest(user.id):''
  }
  res.send(JSON.stringify(userList))
})
// 根据id删除用户
router.post('/delete', async (req, res) => {
  const {user} = req.body
  const data = {err:{code:1,reason:[]}}
  if(Object.keys(user).length){
    if(user?.id){
      const userRow = await UserService.deleteByObj({id:user.id})
      const roleRow = await UserRoleService.deleteByObj({uId:user.id})
      const noticeRow = await UserNoticeService.deleteByObj({userId:user.id})
      if(userRow>0) data.err.code = 0
    }
  }
  res.send(data)
})
router.post('/find', async (req, res) => {
  const {user} = req.body
  const data= {err:{code:1,reason:[]},userList:{}}
  const condition = []
  if(Object.keys(user).length){
    Object.keys(user).forEach(item=>{
      const obj = {}
      obj[`${item}`] = user[item]
      condition.push(obj)
    })
  }
  const userList = await UserService.getUserByProp({[Op.or]:condition})
  if(userList.length){
    data.err.code=0
    data.userList = userList
  }
  res.send(data)
})
// 响应前端登录请求
router.post('/login', async (req, res) => {
  const {user} = req.body
  const data={code:1,loginTime:''}
  const findUserList = await UserService.getUserByProp(user)
  if(findUserList.length===1){
    const {isFreezed} = findUserList[0]
    if(!isFreezed){
      const loginTime = new Date() 
      const loginItem = LoginService.add({
        id:nanoid(),
        userId:findUserList[0].id,
        loginTime,
        signOutTime:null,
        host:111,
        lock:0,
        loginAddress:'陕西省安康市'
      })
      data.loginTime = loginTime
      const token = JWT.generate(user,'180s')
      res.header("Authorization",token)
      data.code = 0
    }else{
      data.code=2
    }
  }
  res.send(data)
})
router.post('/exitLogin',async(req,res)=>{
  const {user} = req.body
  user?.id&&user?.loginTime&&await LoginService.updateByObj({signOutTime:new Date()},{userId:user.id,loginTime:user.loginTime})
})
//冻结或解冻用户
router.post('/update', async (req, res) => {
  const {user} = req.body
  const data = {err:{code:1,reason:[]}}
  if(Object.keys(user).length&&user?.id){
    const rowList =await UserService.updateByObj({isFreezed:user?.isFreezed},user?.id)
    if(rowList.length){
      rowList.every(item=>item>0) ? data.err.code = 0 : data.err.code = 1
    }
  }
  res.send(data)
})
//锁IP或解IP
router.post('/lockIP', async (req, res) => {
  const {
    ip,
    lock
  } = req.body
  const login = await LoginService.updateLockByIP(ip, lock)

  if (login) {
    res.send(JSON.stringify({
      err: 0,
      errInfo: '更新成功'
    }))
  } else {
    res.send(JSON.stringify({
      err: 1,
      errInfo: '更新失败'
    }))
  }
  //更新配置文件
  const filePath = path.join(__dirname, "../../config/baseConfig.conf")
  fileUtil.writeDataToAppoint(filePath, ip, lock)
})
// 根据ID查找用户
router.post('/getUserById', async (req, res) => {
  const {
    id
  } = req.body
  const user = await UserService.getUserById(id)
  if (user) {
    res.status(200).send(JSON.stringify({
      err: 0,
      data: user
    }))
  } else {
    res.status(200).send(JSON.stringify({
      err: 1,
      errInfo: '用户查找失败'
    }))
  }
})
//添加用户信息
router.post('/add', async (req, res) => {
  const {user} = req.body
  const data ={code:1,reason:[]}
  const findUserList = await UserService.getUserByProp({userId:user?.userId})
  if(findUserList.length){
    data.code=1
    data.reason.push('Id字段重复')
  }else{
    user?.id?user.id:user.id = nanoid()
    const createUser = await UserService.add(user)
    if(Object.keys(createUser).length){
      data.code = 0
      data.reason = []
    }else{
      data.code=1
      data.reason = new Array('添加失败')
    }
  }
  res.send(data)
})
//获取用户对应的角色和权限和目录
router.post('/getRoleAndPermission',async(req, res)=>{
  const {userId} = req.body
  const data = {roleList:[],permissionList:[],navList:[]}
  const userRoleList = await UserRoleService.getByObj({uId:userId})
  for await(let userRole of userRoleList){
    const roleList = await RoleService.getByObj({id:userRole?.rId})
    roleList.forEach(role=>{
      data.roleList.every(e=>e!==role)?data.roleList.push(role):''
    })
  }
  for await(let role of data.roleList){
    const rolePermissionList = await RolePermissionService.getByObj({rId:role?.id})
    for await(let rolePermission of rolePermissionList){
      const permissionList = await PermissionService.getByObj({id:rolePermission?.pId})
      permissionList.forEach(permission=>{
        data.permissionList.every(e=>e!==permission)?data.permissionList.push(permission):''
      })
    }
    const navList = await FirstNavService.findByObj()
    navList.forEach(nav=>{
      if(nav?.fatherNavId){
        const firstNavList = data.navList.filter(e=>e.id===nav.fatherNavId)
        if(firstNavList.length===1){
          !Object.hasOwn(firstNavList[0],'children')?firstNavList[0].children = []:''
          firstNavList[0].children.every(e=>e.id!==nav.id)?firstNavList[0].children.push(nav):''
        }
      }else{
        data.navList.every(e=>e.id!==nav.id)?data.navList.push(nav):''
      }
    })
    // const roleNavList = await RoleNavService.getByObj({roleId:role?.id})
    // for await(let roleNav of roleNavList){
    //   const navList = await FirstNavService.findByObj({id:roleNav?.navId})
    //   navList.forEach(nav=>{
    //     data.navList.every(e=>e!==nav)?data.navList.push(nav):''
    //   })
    // }
  }
  res.send(data)
})
router.post('/findUserByObj',async(req,res)=>{
  const {user} = req.body
  let userList =[]
  if(Object.keys(user).length){
    userList = await UserService.getUserByProp(user)
  }
  res.send(userList)
})
router.post('/getUserLogin',async(req,res)=>{
  const {userList} = req.body
  if(userList.length){
    for await(let user of userList){
      const findUserList = await UserService.getUserByProp(user) 
      for await(let findUser of findUserList){
        const loginList = await LoginService.getByObj({userId:findUser?.id})
        user.loginList = loginList
      }
    }
  }
  res.send(userList)
})

module.exports = router;