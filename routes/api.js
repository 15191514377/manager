const router = require('express').Router()

// 设置nav路由
router.use('/nav',require('./api/nav'))
// 设置user路由
router.use('/user',require('./api/user'))
// 设置role路由
router.use('/role',require('./api/role'))
// 设置editor图片上传路由
router.use('/editor',require('./api/editorUpload'))
// 设置notice路由
router.use('/notice',require('./api/notice'))
//设置导出excel路由
router.use('/excel',require('./api/exportExcel'))
//设置permis路由
router.use('/permission',require('./api/permission'))

router.use('/file',require('./api/upload'))

module.exports = router