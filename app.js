const express =require('express')
const app=express()

//导入cors
const cores=require('cors')
var bodyParser=require('body-parser')
//全局挂载
app.use(cores())

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

const jwtConfig=require('./jwt_config/index')
// 统一处理错误；
const {expressjwt:jwt} = require('express-jwt')
app.use(jwt({
    secret:jwtConfig.jwtSecretKey,algorithms:['HS256']
}).unless({
    path:[/^\/api\//]
}))

app.use((err,req,res,next)=>{
    if(err instanceof Joi.ValidationError) return res.cc(err)
})

const loginRouter = require('./router/login')
app.use('/api',loginRouter)

app.listen(3007,()=>{
    console.log('http://127.0.0.1:3007')
})