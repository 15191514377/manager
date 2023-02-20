const {
    nanoid
} = require('nanoid')
//执行mysql的配置文件，连接到mysql连接池
const mysqlPool = require('../config/mysql_config')

const user = {
    getUser: (username, password,res) => {
        //从mysql连接池中获取连接
        mysqlPool.getConnection((err, conn) => {
            if (err) {
                console.log('mysql连接失败');
            }
            conn.query(`select * from users where username = '${username}' and password = '${password}' limit 1`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    console.log('查询用户出错');
                }
                if (rows.length >= 1) {
                    res.header('Content-Type','application/json')
                    res.send(JSON.stringify({login:1,info:'登录成功'}))
                }else{
                    res.header('Content-Type','application/json')
                    res.send(JSON.stringify({login:0,info:'登录失败'}))
                }
            })
        })
    },
    addUser: (data, res) => {
        mysqlPool.getConnection((err, conn) => {
            if (err) {
                console.log('mysql连接失败');
            }
            console.log(data);
            conn.query(`INSERT INTO users (id, username, password, token, phone, email, sex, createTime, isFreezed) VALUES('${nanoid()}', '${data.username}', '${data.password}', '${data.token}', '${data.phone}', '${data.email}', '${data.sex}', '${new Date().toLocaleString()}', ${parseInt('1')})`,
                (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        console.log('用户添加失败');
                    }
                    console.log('rows', rows);
                    console.log('fields', fields);
                })
        })
    }
}

module.exports = user