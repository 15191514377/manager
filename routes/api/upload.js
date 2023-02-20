const router = require('express').Router()
const multiparty = require('multiparty')
const fileUtil = require('../../config/fileUtil') 
const fs = require('fs')
const path = require('path')

router.post('/upload',async(req,res)=>{
    const fm = new multiparty.Form()
    const data = {err:{code:0,reason:[]},fileList:[]}
    fm.parse(req,async(err,fields,files)=>{
        if(files&&Object.keys(files).length){
            Object.keys(files).forEach(item=>{
                const file = files[item]
                file.forEach(e=>{
                    const {upload_path, upload_path_uri } = fileUtil.http2local(e.path)
                    if(upload_path_uri){
                        const fileItem = {name:e.originalFilename,url:upload_path_uri,localUrl:upload_path}
                        data.fileList.every(item=>JSON.stringify(item)!==JSON.stringify(fileItem))&&data.fileList.push(fileItem)
                    }else{
                        data.err.code=1
                        data.err.reason.every(item=>item!==e.originalFilename)&&data.err.reason.push(e.originalFilename)
                    }               
                })
            })
        }
    res.send(data)
    })
})

router.post('/delete',async(req,res)=>{
    const {fileJSON} = req.body
    const file  = JSON.parse(fileJSON)
    const fileName = file.url.slice('36')
    const fileLocalPath =  path.resolve(__dirname,'../../public/upload/',fileName)
    fileUtil.deleteFile(fileLocalPath)
    res.send({err:0})
})

module.exports = router