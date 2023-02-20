const xlsx = require('xlsx');

const excelUtil = {
    exportExcel: (data,sheetName='表1')=>{
        const jsonData = JSON.stringify(data)
        const jsonWorkSheet = xlsx.utils.json_to_sheet(data)
        const workBook = {
            SheetNames:[sheetName],
            Sheets:{
                [sheetName]:jsonWorkSheet
            }
        }
        return xlsx.write(workBook,{type:'binary'})
    }
}

module.exports = excelUtil