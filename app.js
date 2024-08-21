const express =require('express')
const app=express()

//导入cors
const cores=reqquire('cors')
var bodyParser=require('body-parser')
//全局挂载
app.use(cores())

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.listen(3007,()=>{
    console.log('http://127.0.0.1:3007')
})