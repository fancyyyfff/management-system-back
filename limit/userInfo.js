const joi = require('joi')

const id=joi.required()
const name = joi.string().pattern(/^[\u4e00-\u9fa5]{2,10}(·[\u4e00-\u9fa5]{2,10}){0,2}$/).required()
const oldPassword = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()
const newPassword = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()

exports.name_limit = {
    // 表示对req.body里面的数据进行验证
    body:{
        id,
        oldPassword,
        newPassword
    }
}


exports.changeName_limit = {
    // 表示对req.body里面的数据进行验证
    body:{
        name,
        id
    }
}

exports.password_limit = {
    // 表示对req.body里面的数据进行验证
    body:{
        id,
        oldPassword,
        newPassword
    }
}

exports.forgetPassword_limit = {
    // 表示对req.body里面的数据进行验证
    body:{
        id,
        newPassword
    }
}