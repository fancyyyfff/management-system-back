const joi = require('joi')
// string():只能为字符串
// alphanum()：只能是A-Z a-z 0-9
// min(6):最小长度为6
// max(12)：最大长度为12
// required():必填项
// pattern():括号里面写正则表达式
const account = joi.string().alphanum().min(6).max(12).required()
const password = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()

exports.login_limit = {
    // 表示对req.body里面的数据进行验证
    body:{
        account,
        password
    }
}