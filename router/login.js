//登录注册板块路由
//导入
const express=require('express')
//导入路由处理模块
const loginHandle=require('../router_handle/login')
const expressJoi = require('@escook/express-joi')
const {login_limit} = require('../limit/login')
//使用
const router=express.Router()
router.post('/register',expressJoi(login_limit),loginHandle.register)
router.post('/login',expressJoi(login_limit),loginHandle.login)
//向外暴露
module.exports=router