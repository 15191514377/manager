const fs = require('fs')
const path = require('path')
const {nanoid} = require('nanoid')
const fileUtil = {
    deleteFile: (filePath) => {
        //1.判断路径是否存在
        if (fs.existsSync(filePath)) {
            //2.判断路径是否为文件
            fs.stat(filePath, (err, stat) => {
                if (!err) {
                    if (stat.isFile) {
                        fs.unlinkSync(filePath)
                    }
                }
            })
        }
    },
    // falg:true=>写内容,false=>删内容
    writeDataToAppoint: (filePath, data, flag) => {
        //1.判断filePath是否为文件
        if (fs.existsSync(filePath)) {
            const fd = fs.openSync(filePath)
            const stats = fs.fstatSync(fd)
            if (stats.isFile()) {
                //2.向文件的指定位置写入内容
                const fileData = fs.readFileSync(filePath).toString()
                if (flag) {
                    if (fileData.indexOf(data) === -1) {
                        const index = fileData.indexOf('IPList') + 9
                        const newFileData = fileData.slice(0, index) + `'${data}',` + fileData.slice(index)
                        fs.writeFileSync(filePath, newFileData)
                    }
                } else {
                    const index = fileData.indexOf(`'${data}',`)
                    const newFileData = fileData.slice(0, index) + fileData.slice(index + 12)
                    fs.writeFileSync(filePath, newFileData)
                }
            }
        }
    },
    //将前端发送的图片存储到本地
    http2local: (file_dir) => {
        if (!file_dir) {
            console.log('文件路径不能为空');
            return ''
        }
        // 获取文件后缀名
        const {ext} = path.parse(file_dir)
        const data = fs.readFileSync(file_dir)
        const id = nanoid()
        const upload_path = path.join(path.resolve('./'), '/public/upload', `${id}${ext}`)
        const upload_path_uri = `http://127.0.0.1:3000/public/upload/${id}${ext}`
        fs.writeFileSync(upload_path, data)
        return {
            upload_path,
            upload_path_uri
        }
    }
}

module.exports = fileUtil