// 数据库
const db = require('../db/index')
// 导入bcrypt,用于密码的加密存储
const bcrypt =require('bcryptjs')
// 文件处理模块
const fs = require('fs')

// 上传轮播图
exports.uploadSwiper =(req,res)=>{
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
    const sql = 'update setting set set_value=? where set_name=?'
    db.query(sql,[
        `http://127.0.0.1:3007/upload/${newName}`,
        // 这里的写name是因为前端传来的每一个图像片段的set_name都是采用了name:这样的键值对的方式
        req.body.name
    ],(err,result)=>{
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:"轮播图上传成功"
        })
        
    })
    
}

// 获取所有轮播图
exports.getAllSwipers =(req,res)=>{
    // 将文件存储到数据库
    const sql = 'select * from setting where set_name like "swiper%"'
    db.query(sql,(err,result)=>{
        if(err) return res.cc(err)
        let array = []
        result.forEach(element => {
            array.push(element.set_value)
        });
        res.send(array)        
    })  
}

// 获取公司名称
exports.getCompanyName =(req,res)=>{
    // 将文件存储到数据库
    const sql = 'select * from setting where set_name = "公司名称"'
    db.query(sql,(err,result)=>{
        if(err) return res.cc(err)
        res.send(result[0].set_value)  
        
    })  
}

// 修改公司名称
exports.changeCompanyName =(req,res)=>{
    // 将文件存储到数据库
    const sql = 'update setting set set_value=? where set_name = "公司名称"'
    db.query(sql, req.body.setValue,(err,result)=>{
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:'修改成功'
        })
        
    })  
}

// 修改公司介绍
exports.changeCompanyIntroduce =(req,res)=>{
    console.log("修改公司介绍接口中req.body中的参数",req.body)
    // 将文件存储到数据库
    const sql = "update setting set set_text=? where set_name = ?"
    db.query(sql, [req.body.setText,req.body.setName],(err,result)=>{
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:'修改成功'
        })
        
    })  
}

// 获取公司介绍
exports.getCompanyIntroduce =(req,res)=>{
    // 将文件存储到数据库
    const sql = 'select * from setting where set_name = ? '
    db.query(sql, req.body.setName,(err,result)=>{
        if(err) return res.cc(err)
        res.send(result[0].set_text)  
    })  
}

// 获取所有公司信息
exports.getAllCompanyIntroduce =(req,res)=>{
    // 将文件存储到数据库
    const sql = 'select * from setting where set_name like "公司%"'
    db.query(sql, (err,result)=>{
        if(err) return res.cc(err)
        res.send(result)  
    })  
}