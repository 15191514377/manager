const fs = require('fs')
const path = require('path')
const router = require('express').Router()


router.use('/', (req, res) => {
    // 通过req获取文件名
    const file_name = req.url.substring(req.url.lastIndexOf('\\') + 2)
    // 获取文件在磁盘上的路径
    const file_path = path.join(path.resolve('./'), '/public', file_name)
    if (fs.existsSync(file_path)) {
        const cs = fs.createReadStream(file_path)
        cs.on('data', chunk => {
            res.write(chunk)
        })

        cs.on('end', () => {
            res.status(200)
            res.end()
        })
    }
})



module.exports = router