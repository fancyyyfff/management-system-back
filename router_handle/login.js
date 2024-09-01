const db = require('../db/index')
// 导入bcrypt,用于密码的加密存储
const bcrypt =require('bcryptjs')
// 导入jwt，用于生成token
const jwt = require('jsonwebtoken')
// 导入jwt配置文件，用于加密和解密
const jwtConfig = require('../jwt_config/index')

// app.js入口文件已经引入并且使用了express框架,这里可以直接使用send
// send方法并不是JavaScript语言自带的，而是通过XMLHttpRequest对象实现的。
//在Node.js 环境中，send方法通常与Express框架一起使用，Express框架提供了res.send 方法，用于发送HTTP响应。
//因此，send方法在Node.js 和Express框架中是自带的，但它是基于XMLHttpRequest的原理实现的。

exports.register = (req,res) => {
    // 第一步：判断账号或密码是否为空
    const regInfo = req.body
    if(!regInfo.account||!regInfo.password){
        return res.send({
            status:1,
            message:'账号名或密码不能为空'
        })
    }
    // 第二步：判断帐号是否存在
    // 使用sql查询语句
    const sql='select * from user_table where account=?'
    // 第一个参数是sql语句，第二个参数是参数，第三个是一个函数，用于处理结果
    db.query(sql,regInfo.account,(err,result)=>{
        // if (err) {
        //     console.log(err)
        //     return res.send({ status: 1, message: '查询失败' });
        // }
        if(result&&result.length>0){
            return res.send({
                status:1,
            message:'账号已存在'
            })
        }
    // 第三步：不存在：加密存储
    // 使用中间件 bcrypt.js
    // 先安装包 npm i bcrypt
    // 密码加密
    // 第一个参数是传入的密码，第二个参数是加密的长度
    regInfo.password=bcrypt.hashSync(regInfo.password,10)


    // 第四步：把账号和密码插入到表中
    // 只要是符合表格式的数据，都可以插入
    const sql1='insert into user_table set ?'

//     const sql1 = `
//     INSERT INTO your_table_name (account, password, identity, create_time, status) 
//     VALUES (?, ?, ?, ?, ?);
// `; 

// 注册身份
const identity = '用户';
const create_time = new Date();

db.query(sql1, {
    account:regInfo.account,
    password:regInfo.password,
    identity,
    create_time,
    // 初始未冻结状态为0
    status:0
}, (err, result) => {
    if (err) {
        console.log("发生错误：" + err);
        return res.send({
            status: 1,
            message: '注册失败，发生错误: ' + err
        });
    }
    // 添加失败
    // 影响行数没有影响
    console.log('result是：' + JSON.stringify(result));
    if (!result || result.affectedRows !== 1) {
        return res.send({
            status: 1,
            message: '注册失败'
        });
    }
    res.send({
        status: 1,
        message: '注册成功'
    });
});   
})   
}
exports.login = (req,res) => {
    const logInfo = req.body

    // 第一步：判断账号是否存在
    const sql = 'select * from user_table where account = ?'
    db.query(sql,logInfo.account,(err,result)=>{
        if(err) return res.cc(err)
        if(result.length!==1) return res.cc('登录失败')
    // 第二步：比较前端的密码和数据库的密码是否一致
        const compareResult = bcrypt.compareSync(logInfo.password,result[0].password)
        if(!compareResult){
            return res.cc('登录失败')
        }
    // 第三步：判断账号是否冻结
        if(result[0].status==1){
            return res.cc('账号被冻结')
        }    
    // 第四步：生成并返回token给前端保存
    // 剔除加密后的密码、头像、创建时间、更新时间
    const user = {
        ...result[0],
        password:'',
        imageUrl:'',
        create_time:'',
        update_time:'',
    }
    // 设置token的有效时长
    const tokenStr = jwt.sign(user,jwtConfig.jwtSecretKey,{
        expiresIn:'7h'
    })
    // 返回给前端的数据
    res.send({
        results:result[0],
        status:0,
        message:'登录成功',
        token:'Bearer '+tokenStr
    })
    })
}