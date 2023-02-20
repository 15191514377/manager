// 文件下载
const router = require('express').Router()
const path =require('path')

router.use('/',(req,res)=>{
    const urlpath = req.url
    const filepath = path.join(__dirname,'../public/',urlpath)
    const basename = path.basename(filepath)

    res.download(filepath,basename)
})

module.exports = router