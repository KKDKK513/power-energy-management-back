module.exports = app => {

    const assert = require('http-assert')
    const auth = require('../../middleWares/auth')
    const Role = require('../../models/system/Role')

    const { queryAsync } = require('../../plugins/db')
    const pool = require('../../plugins/db')
    const { 
        sqlSelectFormat, 
        sqlUpdateFormat, 
        timeFileter, 
        dataPagination, 
        sqlInsertAllFormat,
        sqlDelFormat,
        strQuot } = require('../../utils/tools')
    /**
     * @description 新增角色
     * */
    app.post('/role', auth('system:role:insert'), async (req, res) => {
        const {roleType} = req.body
        const role = await Role.findOne({roleType})
        assert(!role, 422, '该角色类型已经存在，请不要重复添加。')
        await Role.create(req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 查询角色列表
     * */
    app.get('/system/role/list', auth('system:role:list'), async (req, res) => {
        console.log(123);
        const {pageNum, pageSize, roleName, roleKey, status} = req.query
        let params = { 
            role_name: roleName,
            role_key: roleKey,
            status,
        }
        try {
            let totalList = await queryAsync("SELECT * FROM `sys_role` ")
            console.log(sqlSelectFormat("SELECT * FROM `sys_role`", params));
            let userList = await queryAsync(sqlSelectFormat("SELECT * FROM `sys_role`", params))
            // console.log(userList, pageSize, pageNum);
            let _roleList = dataPagination(userList, pageSize, pageNum).map(item => {
                return{
                    createBy: item.create_by,
                    createTime: timeFileter(item.create_time),
                    remark: item.remark,
                    roleId: item.role_id,
                    delFlag: item.del_flag,
                    roleName: item.role_name,
                    roleKey: item.role_key,
                    roleSort: item.role_sort,
                    status: item.status,
                }
            })
            _roleList = _roleList.filter(item => {
                return item.delFlag == 0
            } )
            // console.log(_userList, '_userList');
            res.send({
                code: 200,
                message: '操作成功',
                total: totalList.length,
                data: _roleList
            })
        } catch (e) {
            res.send({
                code: 201,
                message: e
            })
        }
    })

    /**
     * @description 查询角色详情信息
     * */
    app.get('/system/role/:roleId', auth('system:role:detail'), async (req, res) => {
        const {roleId} = req.params
        
        // console.log(roleId);
        // console.log(sqlSelectFormat("SELECT * FROM `sys_role`", { role_id:  roleId}));
        queryAsync(sqlSelectFormat("SELECT * FROM `sys_role`", { role_id:  roleId})).then(res1 => {
            if(res1[0]) {
                let data = {
                    roleKey: res1[0].role_key,
                    roleName: res1[0].role_name,
                    roleId: res1[0].role_id,
                    status: res1[0].status,
                    remark: res1[0].remark,
                }
                res.send({
                    code: 200,
                    message: '操作成功',
                    data
                })
            }
        }).catch(e => {
            res.send({
                code: 201,
                message: e
            })
        })
    })

    /**
         * @description 新增角色信息
         * */
    app.post('/system/role/add', auth('system:role:add'), async (req, res) => {
        console.log(req.body, 'req');
        // 验证库里是否有同名角色 role_name
        let querySameRoleRes
        try {
            querySameRoleRes = await queryAsync(sqlSelectFormat("SELECT * FROM `sys_role`", { role_name: req.body[0].roleName }))
        } catch(e) {
            console.log(e);
            res.send({
                code: 201,
                message: e,
            })
            return
        }
        if(querySameRoleRes && querySameRoleRes.length > 0) {
            res.send({
                code: 201,
                message: '角色名称已存在',
            })
            return
        }
        let menuIdArr = []
        let data = req.body.map(item => {
            return{
                role_name: item.roleName,
                role_key: item.roleKey,
                status: item.status,
                create_time: timeFileter(new Date())
            }
        })
        let promiseArr = []
        let promise1
        pool.getConnection(function(err, connection) {
            if (err) {
                res.send({
                    code: 201,
                    message: err,
                })
                return
            }
            connection.beginTransaction(async err => {
                if (err) {
                    res.send({
                        code: 201,
                        message: '开启事务失败',
                    })
                    return
                }
                try{
                    promise1 = await new Promise((resolve, reject) => {
                        connection.query(sqlInsertAllFormat("INSERT INTO `sys_role`", data), (e, rows, fields) => {
                            e ? reject(e) : resolve({ rows, success: true })
                        })
                    })
                } catch(e) {
                    connection.rollback(() => {
                        console.log('数据操作回滚')
                    })
                    res.send({
                        code: 201,
                        message: e,
                    })
                    return
                }
                console.log(promise1, 'promise1');
                req.body.forEach(item => {
                    item.menuIds.forEach(element => {
                        menuIdArr.push({
                            role_id: promise1.rows.insertId,
                            menu_id: element,
                        })
                    });
                })
                promiseArr.push(queryAsync(sqlInsertAllFormat("INSERT INTO `sys_role_menu`", menuIdArr)))
                // promiseArr.push(queryAsync(sqlInsertAllFormat("INSERT INTO `sys_user_post`", postIdArr)))
                // Promise调用所有sql，一旦出错，回滚，否则，提交事务并释放链接
                Promise.all(promiseArr).then(res1 => {
                connection.commit((error) => {
                    if (error) {
                        console.log('事务提交失败')
                        res.send({
                            code: 201,
                            message: error,
                        })
                    }
                })
                    connection.release()  // 释放链接
                    res.send({
                        code: 200,
                        message: "操作成功",
                    })
                }).catch(err => {
                    connection.rollback(() => {
                        console.log('数据操作回滚')
                    })
                    const errAsObject = {
                        name: err.name,
                        message: err.message,
                        stack: err.stack
                        // 其他您希望包含的属性
                        };
                    res.send({
                        code: 201,
                        message: errAsObject.message,
                    })
                })
            })
        });
    
    })  

    /**
     * @description 修改角色信息
     * */
    app.post('/system/role/update', auth('system:role:update'), async (req, res) => {
        let data = {
            status: req.body.status,
            role_name: req.body.roleName,
            role_key: req.body.roleKey,
            remark: req.body.remark,
        }
        let promise1 = null
        let promiseAll = []
       
        console.log(req.body);
        pool.getConnection(function(err, connection) {
            if (err) {
                res.send({
                    code: 201,
                    message: err,
                })
                return
            }
            connection.beginTransaction(async err => {
                if (err) {
                    res.send({
                        code: 201,
                        message: '开启事务失败',
                    })
                    return
                }
              
              
                promiseAll.push(queryAsync(sqlUpdateFormat("UPDATE `sys_role`", data, { role_id:req.body.roleId })))

                if(req.body.menuIds && (req.body.menuIds.length > 0)) {
                    // console.log(sqlDelFormat("DELETE FROM `sys_user_post`", { user_id:req.body.userId }));
                    let menuIdsArr = []
                    req.body.menuIds.forEach(element => {
                        menuIdsArr.push({
                            role_id: req.body.roleId,
                            menu_id: element,
                        })
                    });
                    promise1 = new Promise((resolve, reject) => {
                        const executeAsyncFunctions = async () => {
                            try {
                                await queryAsync(sqlDelFormat("DELETE FROM `sys_role_menu`", { role_id:req.body.roleId }))
                                await queryAsync(sqlInsertAllFormat("INSERT INTO `sys_role_menu`", menuIdsArr))
                                resolve()
                            } catch(e) {
                                reject(e)
                            }
                        }
                        executeAsyncFunctions()
                    })
                    promiseAll.push(promise1)
                }

                
                // Promise调用所有sql，一旦出错，回滚，否则，提交事务并释放链接
                Promise.all(promiseAll).then(res1 => {
                  connection.commit((error) => {
                      if (error) {
                          console.log('事务提交失败')
                          res.send({
                            code: 201,
                            message: error,
                        })
                      }
                  })
                    connection.release()  // 释放链接
                    res.send({
                        code: 200,
                        message: "操作成功",
                    })
                }).catch(err => {
                    connection.rollback(() => {
                        console.log('数据操作回滚')
                    })
                    console.log(err);
                    const errAsObject = {
                        name: err.name,
                        message: err.message,
                        stack: err.stack
                        // 其他您希望包含的属性
                        };
                    res.send({
                        code: 201,
                        message: errAsObject.message,
                    })
                })
            })
        });
    })


    /**
     * @description 删除角色信息
     * */
    app.post('/system/role/delete', auth('system:role:delete'), async (req, response) => {
        queryAsync(sqlDelFormat("DELETE FROM `sys_role`", { role_id: req.body.roleId })).then(res => {
            response.send({
                code: 200,
                message: '操作成功',
            })
        }).catch(err => {
            response.send({
                code: 201,
                message: err,
            })
        })
    })

}
