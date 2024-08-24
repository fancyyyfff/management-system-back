const mysql = require('mysql')

const db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'161616',
    database:'back_system'
})

module.exports = db