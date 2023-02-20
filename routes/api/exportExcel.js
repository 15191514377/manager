const router = require('express').Router()
const excelUtil = require('../../config/excelUtil')
const UserService = require('../../service/UserService')

router.get('/getUser', async (req, res) => {
    const userList = await UserService.getAllWithNothing()
    const fileBuffer = excelUtil.exportExcel(userList, '用户详情')
    var excelMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    res.header('Content-Type', excelMimeType)
    res.send(new Buffer(fileBuffer,'binary'))
})

module.exports = router