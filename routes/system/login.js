module.exports = app => {
    const assert = require('http-assert')
    const jwt = require('jsonwebtoken')
    const User = require('../../models/system/User')
    const Record = require('../../models/system/Record')
    const bcrypt = require('bcryptjs');
    const { queryAsync } = require('../../plugins/db')
    // 加密
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync("admin123", salt);
    /**
     * @description 用户登录
     * */
    app.post('/login', async (req, response) => {
        const {userName, password} = req.body
        let sql = "SELECT * FROM `sys_user` WHERE `user_name` LIKE '%"+ userName +"%'"
        console.log(req.body, sql);
        queryAsync(sql).then(res => {
            console.log(res);
            if(res.length == 0) {
                response.send({
                    code: 201,
                    message:
                    "用户不存在"
                });
                return
            } else {
                if(res[0].status == 1) {
                    response.send({
                        code: 201,
                        message: '该账号目前已停用，请联系管理员',
                    })
                    return
                }
                let isLogin = bcrypt.compareSync(password, res[0].password);
                // console.log(password, res[0].password, isLogin);
                if(!isLogin) {
                    response.send({
                        code: 201,
                        message: '密码错误',
                    })
                } else {
                    // console.log(res[0].user_id);
                    const token = jwt.sign({
                        id: res[0].user_id
                    }, app.get('SECRET'), { expiresIn: 3600*6 })
                    response.send({
                        code: 200,
                        message: '登录成功',
                        token
                    })
                }
            }
        }).catch(e=>{
            response.send({
                code: 201,
                message: e,
            })
        })
   
    })

    /**
     * @description 退出登录
     * */
    app.post('/logout', async (req, response) => {
        const token = String(req.headers.authorization || '').split(' ').pop();
        console.log(token, 'token');
        jwt.verify(token, req.app.get('SECRET'), function(err, decoded) {
            if(err) {
                response.send({
                    code: err.message == "jwt expired" ? 200 : 201,
                    message: err.message
                })
            } else {
                let sql = "SELECT * FROM `sys_user` WHERE `user_id` LIKE '"+ decoded.id +"'"
                queryAsync(sql).then(res => {
                    console.log(res);
                    if(res.length == 0) {
                        response.send({
                            code: 201,
                            message: '当前用户不存在，请联系管理员。'
                        })
                    } else {
                        response.send({
                            code: 200,
                            message: '操作成功'
                        })
                    }
                })
            }
        })
    })
}