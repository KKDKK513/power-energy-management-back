module.exports = permission => {
    const jwt = require('jsonwebtoken');
    const assert = require('http-assert');
    const { queryAsync } = require('../plugins/db')
    return async (req, res, next) => {
        // 获取前端传过来的请求头里的认证信息，处理后转为token，并验证token
        console.log(req.headers.authorization);
        const token = String(req.headers.authorization || '').split(' ').pop();
        // assert(token, 401, '系统检测到您还没有登录，请先登录！');
        if(!token) {
            res.status(200).send({ code: 401, msg: '系统检测到您还没有登录，请先登录！' });
            return
        }
        // 服务端通过给出的secret验证生成的token，将之前传入的id解密出来，进行验证
        let id 
        let tokenStatus = true
        jwt.verify(token, req.app.get('SECRET'), function(err, decoded) {
            if(err) {
                // assert(!err, 401, err.message);
                console.log({ code: 401, msg: err.message });
                tokenStatus = false
                res.status(200).send({ code: 401, msg: 'token过期，请重新登录！' });
            } else {
                id = decoded.id
            }
        })
        if(!tokenStatus) return
        // 根据id查找数据库，验证用户是否存在
        let sql = "SELECT * FROM `sys_user` WHERE `user_id` LIKE '"+ id +"'"
        let user = await queryAsync(sql)
        if(user.length == 0) {
            res.send({
                code: 201,
                message: '用户不存在'
            })
            return
        }
        let rolesId = await queryAsync("SELECT * FROM `sys_user_role` WHERE `user_id` = '"+ id +"'")
        // console.log(rolesId, 'rolesId');
        rolesId = rolesId.map(item=>{
            return item.role_id
        })
        let menusId
        if(user[0].user_name == "admin") {
            menusId = await queryAsync("SELECT * FROM `sys_menu`")
        } else {
            menusId = await queryAsync("SELECT * FROM `sys_role_menu` WHERE (`role_id` IN ("+ rolesId.join(',') +"))")
        }
        menusId = Array.from(new Set(menusId.map(item=>{
            return item.menu_id
        }))) 
        // console.log(rolesId, menusId);
        let permissions
        if(user[0].user_name == "admin") {
            permissions = [{ perms: '*:*:*' }]
        } else {
            if(menusId.length != 0) {
                permissions = await queryAsync("SELECT * FROM `sys_menu` WHERE `menu_id` IN ("+ menusId.join(',') + ")")
            }
        }
        req.user = user[0]
        req.permissions = permissions
        req.rolesId = rolesId
        req.id = id
        /**
         *  判断该用户是否拥有操作权限
         *  '*:*:*'表示全部权限
         *  permission == '*:*:*'表示该请求不需要权限
         *  req.user.permissions.includes('*:*:*')用于验证该用户是否拥有全部权限
         *  req.user.permissions.includes(permission)用于验证当前用户是否具有permission权限
         * */
        if(user[0].user_name == 'admin' || permission == '*:*:*') {
            next();
            return
        } 
        if (user[0].user_name != 'admin' && !permissions.includes(permission)) {
            res.send({
                code: 401,
                message: '没有相关操作权限，请联系管理员'
            })
            return
        }
    }
}
