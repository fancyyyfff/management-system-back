// 数据库
const db = require('../db/index')
// 导入bcrypt,用于密码的加密存储
const bcrypt =require('bcryptjs')
// 导入node.js的crypto库生成uuid
const crypto = require('crypto')
// 文件处理模块
const fs = require('fs')
const { func } = require('joi')

exports.uploadAvatar =(req,res)=>{
    // 生成唯一标识
    const onlyId = crypto.randomUUID()
    // 保存上传文件时随机生成的文件名
    // req.files是multer提供的属性，处理文件上传 ，[0]表示第一个上传的文件，是一个对象
    // 使用[0]获取对应着upload.any(),设为一个数组
    let oldName = req.files[0].filename;
    let newName = Buffer.from(req.files[0].originalname,'latin1').toString('utf8')
    const fs = require('fs');
    // fs.renameSync('./public/upload/'+oldName,'./public/upload/'+newName)
try {
    fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName);
} catch (err) {
    console.error('Error renaming file:', err);
    // 可以选择向客户端返回错误信息
    return res.status(500).send({ message: 'File renaming failed', error: err.message });
}

    // 将文件存储到数据库
    const sql = 'insert into image set ?'
    db.query(sql,{
        image_url:`http://127.0.0.1:3007/upload/${newName}`,
        only_id:onlyId
    },(err,result)=>{
        if(err) return res.cc(err)
        res.send({
            onlyId,
            status:0,
            url:'http://127.0.0.1:3007/upload/'+newName
        })
    })
    
}

// 获取用户的账号
exports.getUserInfo = (req,res)=>{
    console.log("在后端的getUserInfo接口中，获取到的前端请求中的id为",req.body.id)
    const sql='select * from user_table where id=?'
    db.query(sql,req.body.id,(err,result)=>{
        if(err) return res.cc(err)
        // 如果存在用户就返回用户的信息
        res.send(result)        
    })
}

// 修改用户姓名
exports.changeName=(req,res)=>{
    const sql='update user_table set name=? where id=?'
    db.query(sql,[req.body.name,req.body.id],(err,result)=>{
        if(err) return res.cc(err)
        res.send({
           status:0,
           message:'修改成功'
    })
    })
}

// 修改密码
exports.changePassword = (req,res)=>{
let {oldPassword,newPassword,id} =req.body
// 1. 判断输入的原密码是否存在
const sql='select password from user_table where id=?'
db.query(sql,id,(err,result)=>{
    if(err) return res.cc(err)
    // 数据库中查询到的密码
    const password = result[0].password
    // 密码比较
    const compareResult= bcrypt.compareSync(oldPassword,password)
    // 若不存在，返回错误处理，
    if(!compareResult){
        res.send({
            status:1,
            message:'原密码出错'
        })
    }
    // 把新密码加密处理
    newPassword=bcrypt.hashSync(newPassword,10)
    // 2. 存在：密码加密再修改
    const sql1 = 'update user_table set password=? where id=?'
    db.query(sql1,[newPassword,id],(err,result)=>{
        if(err)return res.cc(err)
        res.send({
            status:0,
            message:'密码修改成功'
    })
    })
})
}

// 忘记密码：
// 1. 验证账号和邮箱是否存在
exports.verifyAccountAndEmail = (req,res)=>{
    const {account,email} = req.body
    const sql='select * from user_table where account=?'
    db.query(sql,[account,email],(err,result)=>{
        if(err) return res.cc(err)
        if(email!=result[0].email){
            res.send({
                status:1,
                message:'验证失败'          
            })
        }else {
            res.send({
                status:0,
                message:'验证成功',
                id:result[0].id
            })

        }
    })  
}

// 2. 修改密码
exports.changePasswordInLogin = (req,res)=>{
    const user = req.body
    const sql ='update user_table set password = ? where id=?'
    user.newPassword=bcrypt.hashSync(user.newPassword,10)
    db.query(sql,[user.newPassword,user.id],(err,result)=>{
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:'修改成功'
    })
    })
}

// 绑定账户
exports.bindAccount = (req,res) =>{
    const {account,onlyId,imageUrl} = req.body
    console.log("调用bindAccount方法，在后端获取到的account是",account)
    console.log("调用bindAccount方法，在后端获取到的imageUrl是",imageUrl)
    // 先绑定Onlyid和account在image表
    const sql = 'update image set account=? where only_id=?'
    db.query(sql,[account,onlyId],(err,result)=>{
        if(err) return res.cc(err)
        if(result.affectedRows==1){
            // 再把图片的链接绑定在user表
            const sql1 = 'update user_table set image_url=? where account=?'
            db.query(sql1,[imageUrl,account],(err,result)=>{
                if(err) return res.cc(err)
                res.send({
                    status:0,
                    message:'账号与图片绑定成功'           
                })
            })
        }
        
    })
}

