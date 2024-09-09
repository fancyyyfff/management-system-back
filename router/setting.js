//导入
const express=require('express')
const router=express.Router()
// 处理逻辑的文件
const settingHander=require('../router_handle/setting')
router.post('/uploadSwiper',settingHander.uploadSwiper)
router.post('/getAllSwipers',settingHander.getAllSwipers)
// router.post('/login',settingHander.login)
router.post('/getCompanyName',settingHander.getCompanyName)
router.post('/changeCompanyName',settingHander.changeCompanyName)
router.post('/changeCompanyIntroduce',settingHander.changeCompanyIntroduce)
router.post('/getCompanyIntroduce',settingHander.getCompanyIntroduce)
router.post('/getAllCompanyIntroduce',settingHander.getAllCompanyIntroduce)


//向外暴露
module.exports=router