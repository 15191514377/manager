const {Sequelize} = require('sequelize')

const connect = new Sequelize('manager', 'root', 'Hzq@1234', {
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql'
})


module.exports = connect