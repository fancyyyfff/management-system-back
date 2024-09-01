//导入
const express=require('express')
const router=express.Router()
// 用于表单处理
const expressJoi = require('@escook/express-joi')
// 处理逻辑的文件
const userInfoHander=require('../router_handle/userInfo')
const {name_limit,password_limit} = require('../limit/userInfo')


// 设置路由的路径和处理逻辑的方法
router.post('/uploadAvatar',userInfoHander.uploadAvatar)
router.post('/getUserInfo',userInfoHander.getUserInfo)
router.post('/changeName',expressJoi(name_limit),userInfoHander.changeName)
router.post('/changePassword',expressJoi(password_limit),userInfoHander.changePassword)

// 记得向外暴露路由
module.exports = router