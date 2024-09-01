const Joi = require('joi');
const express =require('express')
const app=express()

//导入cors，处理跨域问题
const cors=require('cors')
var bodyParser=require('body-parser')
//全局挂载
app.use(cors())

// 上传文件用到的：
// 用于上传文件，是node.js的一个中间件
const multer =require('multer')
// 在服务端下新建一个public为文件，在public文件下新建一个upload文件存放图片（运行项目会自动创建）
const upload = multer({dest:'./public/upload'})
app.use(upload.any())
// 静态托管
app.use(express.static('./public'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((req,res,next) => {
    res.cc = (err,status=1)=> {
        res.send({
            status,
            message:err instanceof Error ? err.message : err,
        })       
    }
    next()
})

// 这个jwt很可能存在问题，但是暂时没有发现
const jwtConfig=require('./jwt_config/index')
// 统一处理错误；
const {expressjwt:jwt} = require('express-jwt')
// 暂时停用jwt
// app.use(jwt({
//     secret:jwtConfig.jwtSecretKey,algorithms:['HS256']
// }).unless({
//     path:[/^\/api\//]
// }))

// 处理登录注册数据有误的信息，采取后面的更优的方案
// app.use((err,req,res,next)=>{
//     if(err) console.log("请求数据有误"+err)
//     if(err instanceof Joi.ValidationError) return res.cc(err)
// })

// 处理各种错误
app.use((err, req, res, next) => {
    // 1. 处理 Joi 验证错误
    if (err instanceof Joi.ValidationError) {
        return res.cc(err, 400); // 400 Bad Request
    }

    // 2. 处理 JWT 认证错误
    if (err.name === 'UnauthorizedError') {
        return res.cc('Invalid token', 401); // 401 Unauthorized
    }

    // 3. 处理数据库错误
    if (err.code && err.code.startsWith('ER_')) {
        return res.cc('Database error: ' + err.message, 500); // 500 Internal Server Error
    }

    // 4. 处理文件系统错误
    if (err.code && err.code.startsWith('ENOENT')) {
        return res.cc('File system error: ' + err.message, 404); // 404 Not Found
    }

    // 5. 处理其他类型的错误
    if (err instanceof Error) {
        console.error('Unexpected error:', err); // 记录错误日志
        return res.cc('Internal server error: ' + err.message, 500); // 500 Internal Server Error
    }

    // 6. 处理未捕获的错误
    res.cc('An unknown error occurred', 500); // 500 Internal Server Error
});


// 路由：
// 注册的路由
const loginRouter = require('./router/login')
app.use('/api',loginRouter)
// 查看用户详情的路由
const userRouter = require('./router/userInfo')
app.use('/user',userRouter)

// 考虑在全局处理未捕获的异常，确保在生产环境中，服务器不会因未处理的异常而崩溃。
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1); // 强制退出进程
});

// 服务器启动
app.listen(3007,()=>{
    console.log('http://127.0.0.1:3007')
})


