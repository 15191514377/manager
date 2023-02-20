const fs = require('fs');
const {
    nanoid
} = require('nanoid')
const path = require('path')

const parse_file = function (file_dir) {
    if (file_dir === '') {
        console.log('文件路径不能为空');
        return ''
    }
    // 获取文件后缀名
    const {
        ext
    } = path.parse(file_dir)
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
module.exports = parse_file