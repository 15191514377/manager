const router = require('express').Router()
const multiparty = require('multiparty')
const fs = require('fs')
const path = require('path')
const {nanoid} = require('nanoid')

//处理wangEditor上传图片时的请求
router.post('/img',(req,res)=>{
    const form = new multiparty.Form()
    form.parse(req,(err,fields,files)=>{
        if(!err){
            const imgList = files['wangeditor-uploaded-image']
            let pathList = []
            imgList.forEach(item=>{
                pathList.push(item.path)
            })
            // 设置服务器保存editor上传图片的路径,若路径不存在，则创建目录
            const dir = path.join(__dirname,'../../','/public/upload/editor')
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir)
            }
            pathList.forEach(item=>{
                //获取文件后缀名
                const extname = path.extname(item)
                //生成随机的文件名
                const filename = nanoid()
                //读取文件内容
                const data = fs.readFileSync(item)
                // 生成文件磁盘地址以及网络地址
                const filepath = path.join(dir,`${filename}${extname}`)
                const filepathURI = `http://127.0.0.1:3000/public/upload/editor/${filename}${extname}`
                fs.writeFileSync(filepath,data)
                res.header('Content-Type','application/json;charset=utf-8')
                res.send(JSON.stringify({
                    "errno":0,
                    "data":{
                        "url":filepathURI,
                    }
                }))
            })
        }
    })
})

module.exports = router