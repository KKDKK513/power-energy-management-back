module.exports = app => {

    const assert = require('http-assert')
    // const User = require('../../models/system/User')
    // const Department = require('../../models/system/Department')
    const auth = require('../../middleWares/auth')
    const { handleTree, 
            upperFirstLetter, 
            sqlSelectFormat, 
            sqlUpdateFormat, 
            timeFileter, 
            dataPagination, 
            sqlInsertAllFormat,
            sqlDelFormat,
            strQuot } = require('../../utils/tools')
    const bcrypt = require('bcryptjs');
    var salt = bcrypt.genSaltSync(10);
    const { queryAsync, execTransection } = require('../../plugins/db')
    const pool = require('../../plugins/db')
    /**
     * @description 查询信息列表
     * @param pageNum {Number} 页码
     * @param pageSize {Number} 数量
     * */
    app.get('/system/user/list', auth('system:user:list'), async (req, res) => {
        // console.log(req.query);
        const { pageNum, pageSize, phonenumber, userName, status } = req.query
        let params = {
            phonenumber: phonenumber,
            user_name: userName,
            status,
        }
        try {
            // let totalList = await queryAsync("SELECT * FROM `sys_user` ")
            // console.log(params);
            console.log(sqlSelectFormat("SELECT * FROM `sys_user`", params));
            let userList = await queryAsync(sqlSelectFormat("SELECT * FROM `sys_user`", params))
            // console.log(userList, pageSize, pageNum);
            let totalList = userList.length
            // console.log(userList, totalList);
            let _userList = dataPagination(userList, pageSize, pageNum).map(item => {
                return{
                    createBy: item.create_by,
                    createTime: timeFileter(item.create_time),
                    remark: item.remark,
                    userId: item.user_id,
                    userName: item.user_name,
                    nickName: item.nick_name,
                    email: item.email,
                    phoneNumber: item.phonenumber,
                    sex: item.sex,
                    status: item.status,
                }
            })
            // console.log(_userList, '_userList');
            res.send({
                code: 200,
                message: '操作成功',
                total: totalList,
                data: _userList
            })
        } catch (e) {
            res.send({
                code: 201,
                message: e
            })
        }
    })

    /**
     * @description 返回基本信息列表
     * @param pageNum {Number} 页码
     * @param pageSize {Number} 数量
     * */
    app.get('/user/basic', auth('system:user:list'), async (req, res) => {
        const {pageNum, pageSize, grade} = req.query
        const filter = grade ? {grade} : null
        const total = await User
            .find(filter)
            .countDocuments()
        const rows = await User
            .find(filter, {name: 1, userName: 1, grade: 1})
            .populate('score')
            .skip((pageNum - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))

        res.send({
            code: 200,
            message: '操作成功',
            total,
            rows
        })
    })

    /**
     * @description 根据主键id查询详情信息
     * */
    app.get('/system/user/:id', auth('system:user:detail'), async (req, response) => {
        // console.log(typeof req.params.id);
        // console.log(sqlSelectFormat("SELECT * FROM `sys_user`", { user_id:  parseInt(req.params.id)}));
        let promise1 = queryAsync(sqlSelectFormat("SELECT * FROM `sys_user`", { user_id:  parseInt(req.params.id)}))
        let promise2 = queryAsync(sqlSelectFormat("SELECT * FROM `sys_user_post`", { user_id:  parseInt(req.params.id)}))
        let promise3 = queryAsync(sqlSelectFormat("SELECT * FROM `sys_post`"))
        let promise4 = queryAsync(sqlSelectFormat("SELECT * FROM `sys_user_role`", { user_id:  parseInt(req.params.id)}))
        let promise5 = queryAsync(sqlSelectFormat("SELECT * FROM `sys_role`"))
        let promiseAll = Promise.all( [promise1, promise2, promise3, promise4, promise5 ])
        let data
        let postIds
        let posts
        let roleIds
        let roles
        promiseAll.then(res => {
            // console.log(res, 'res111');
            if(res[0] && res[0].length > 0) {
                let user = res[0][0]
                data = {
                    email: user.email,
                    nickName: user.nick_name,
                    userName: user.user_name,
                    phoneNumber: user.phonenumber,
                    sex: user.sex,
                    remark: user.remark,
                    sex: user.sex,
                    status: user.status,
                    userId: user.user_id,
                }
            }
            if(res[1] && res[1].length > 0) {
                postIds = res[1].map(item => {
                    return item.post_id
                })
            }
            if(res[2] && res[2].length > 0) {
                posts = res[2].map(item => {
                    return {
                        postName: item.post_name,
                        postId: item.post_id,
                    }
                })
            }
            if(res[3] && res[3].length > 0) {
                roleIds = res[3].map(item => {
                    return item.role_id
                })
            }
            if(res[4] && res[4].length > 0) {
                roles = res[4].map(item => {
                    return {
                        roleName: item.role_name,
                        roleId: item.role_id,
                    }
                })
            }
            response.send({
                code: 200,
                message: '操作成功',
                data,
                postIds,
                posts,
                roleIds,
                roles,
            })
        }).catch(err => {
            response.send({
                code: 201,
                message: '未知异常,请联系管理员',
            })
        })
    })
    app.get('/system/user', auth('system:user:detail'), async (req, response) => {

        let promise1 = queryAsync(sqlSelectFormat("SELECT * FROM `sys_post`"))
        let promise2 = queryAsync(sqlSelectFormat("SELECT * FROM `sys_role`"))
        let promiseAll = Promise.all([promise1, promise2])
        let posts
        let roles
        promiseAll.then(res => {
            if(res[0] && res[0].length > 0) {
                posts = res[0].map(item => {
                    return {
                        postName: item.post_name,
                        postId: item.post_id,
                    }
                })
            }
            if(res[1] && res[1].length > 0) {
                roles = res[1].map(item => {
                    return {
                        roleName: item.role_name,
                        roleId: item.role_id,
                    }
                })
            }
            response.send({
                code: 200,
                message: '操作成功',
                posts,
                roles,
            })
        }).catch(err => {
            response.send({
                code: 201,
                message: '未知异常,请联系管理员',
            })
        })
    })

    /**
     * @description 根据主键user_id修改用户信息
     * */
    app.post('/system/user/update', auth('*:*:*'), async (req, res) => {
        // console.log(req.body, 'req');
        let data = {
            status: req.body.status,
            nick_name: req.body.nickName,
            user_name: req.body.userName,
            phonenumber: req.body.phoneNumber,
            email: req.body.email,
            sex: req.body.sex,
            remark: req.body.remark,
        }
        let promiseAll = []
       
        //   UPDATE `power-test`.`sys_user` SET `status` = '0', `del_flag` = '1' WHERE `user_id` = 83
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
              
                // 判断是否有参数  修改user表
                if(Object.values(data).filter(item => item != undefined).length != 0) {
                    promiseAll.push(queryAsync(sqlUpdateFormat("UPDATE `sys_user`", data, {user_id:req.body.userId})))
                }

                if(req.body.postIds && (req.body.postIds.length > 0)) {
                    // console.log(sqlDelFormat("DELETE FROM `sys_user_post`", { user_id:req.body.userId }));
                    let postIdArr = []
                    req.body.postIds.forEach(element => {
                        postIdArr.push({
                            user_id: req.body.userId,
                            post_id: element,
                        })
                    });
                    promise2 = new Promise((resolve, reject) => {
                        const executeAsyncFunctions = async () => {
                            try {
                                await queryAsync(sqlDelFormat("DELETE FROM `sys_user_post`", { user_id:req.body.userId }))
                                await queryAsync(sqlInsertAllFormat("INSERT INTO `sys_user_post`", postIdArr))
                                resolve()
                            } catch(e) {
                                reject(e)
                            }
                        }
                        executeAsyncFunctions()
                    })
                    promiseAll.push(promise2)
                }

                if(req.body.roleIds && (req.body.roleIds.length > 0)) {
                    let roleIdArr = []
                    req.body.roleIds.forEach(element => {
                        roleIdArr.push({
                            user_id: req.body.userId,
                            role_id: element,
                        })
                    });
                    promise3 = new Promise(async(resolve, reject) => {
                        const executeAsyncFunctions = async () => {
                            try {
                                await queryAsync(sqlDelFormat("DELETE FROM `sys_user_role`", { user_id:req.body.userId }))
                                await queryAsync(sqlInsertAllFormat("INSERT INTO `sys_user_role`", roleIdArr))
                                resolve()
                            } catch(e) {
                                reject(e)
                            }
                        }
                        executeAsyncFunctions()
                    })
                    promiseAll.push(promise3)
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
     * @description 根据主键user_id修改用户密码
     * */
    app.post('/system/user/resetPwd', auth('*:*:*'), async (req, response) => {
        // console.log(req.body, 'req');
         // 加密
        let data = {
          password: bcrypt.hashSync(req.body.password, salt)
        }
        console.log(data, 'data',sqlUpdateFormat("UPDATE `sys_user`", data, {user_id:req.body.userId}));
        queryAsync(sqlUpdateFormat("UPDATE `sys_user`", data, {user_id:req.body.userId})).then(res => {
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

    /**
     * @description 修改密码
     * */
    app.post('/resetPassword', async (req, response) => {
            const { userName, oldPassword, newPassword } = req.body;
          
            // 根据用户名查询用户信息
            let sql = "SELECT * FROM `sys_user` WHERE `user_name` LIKE '" + userName + "'";
            queryAsync(sql).then(res => {
              if (res.length === 0) {
                response.send({
                  code: 201,
                  message: "用户不存在"
                });
                return;
              } else {
                if (res[0].status == 1) {
                  response.send({
                    code: 201,
                    message: '该账号目前已停用，请联系管理员',
                  });
                  return;
                }
          
                // 验证旧密码
                let isOldPasswordCorrect = bcrypt.compareSync(oldPassword, res[0].password);
                if (!isOldPasswordCorrect) {
                  response.send({
                    code: 201,
                    message: '旧密码错误',
                  });
                  return;
                }
          
                // 更新密码
                let hashedNewPassword = bcrypt.hashSync(newPassword, 10);
                let updateSql = "UPDATE `sys_user` SET `password` = '" + hashedNewPassword + "' WHERE `user_name` LIKE '" + userName + "'";
                queryAsync(updateSql).then(() => {
                  response.send({
                    code: 200,
                    message: '密码重置成功',
                  });
                }).catch(err => {
                  response.send({
                    code: 201,
                    message: '密码重置失败：' + err,
                  });
                });
              }
            }).catch(e => {
              response.send({
                code: 201,
                message: e,
              });
            });
        });

    /**
     * @description 根据主键user_id删除用户信息
     * */
    app.post('/system/user/delete', auth('*:*:*'), async (req, response) => {
        // console.log(req.body, 'req');
        queryAsync(sqlDelFormat("DELETE FROM `sys_user`", { user_id:req.body.userId })).then(res => {
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

    /**
     * @description 新增用户信息
     * */
    app.post('/system/user/add', auth('*:*:*'), async (req, res) => {
        console.log(req.body, 'req');
        // 验证库里是否有同名账号 user_name
        let querySameUserRes
        try {
            querySameUserRes = await queryAsync(sqlSelectFormat("SELECT * FROM `sys_user`", { user_name: req.body[0].userName }))
        } catch(e) {
            console.log(e);
            res.send({
                code: 201,
                message: e,
            })
            return
        }
        if(querySameUserRes && querySameUserRes.length > 0) {
            res.send({
                code: 201,
                message: '用户名称已存在',
            })
            return
        }
        let roleIdArr = []
        let postIdArr = []
        let data = req.body.map(item => {
            return{
                user_name: item.userName,
                nick_name: item.nickName,
                email: item.email,
                phonenumber: item.phoneNumber,
                sex: item.sex ? item.sex : "0",
                status: item.status,
                remark: item.remark ? item.remark : " ",
                // 默认密码111111
                password: "$2a$10$a9ipSgg8DbZGgOXR4jioLuc21a790NP2MV/VWiVBpzgwHHYK2YVum",
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
                        connection.query(sqlInsertAllFormat("INSERT INTO `sys_user`", data), (e, rows, fields) => {
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
                    item.roleIds.forEach(element => {
                        roleIdArr.push({
                            user_id: promise1.rows.insertId,
                            role_id: element,
                        })
                    });
                })
                req.body.forEach(item => {
                    if(item.postIds) {
                        item.postIds.forEach(element => {
                            postIdArr.push({
                                user_id: promise1.rows.insertId,
                                post_id: element,
                            })
                        });
                    }
                })
                promiseArr.push(queryAsync(sqlInsertAllFormat("INSERT INTO `sys_user_role`", roleIdArr)))
                if(postIdArr.length != 0) {
                    promiseArr.push(queryAsync(sqlInsertAllFormat("INSERT INTO `sys_user_post`", postIdArr)))
                }
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
     * @description 根据token查询详情消息
     * */
    app.get('/getInfo', auth('*:*:*'), async (req, res) => {
        let roles = await queryAsync("SELECT * FROM `sys_role` WHERE `role_id` IN ("+ req.rolesId.join(',') + ")")
        console.log(22, req.rolesId.join(','), roles);
        // let permissions
        // console.log(req.user, 'req.user');
        // if(req.user.user_name == "admin") {
        //     console.log(111);
        //     permissions = [{ perms: '*:*:*' }]
        // } else {
        //     permissions = await queryAsync("SELECT * FROM `sys_menu` WHERE `menu_id` IN ("+ menusId.join(',') + ")")
        // }
        res.send({
            code: 200,
            message: '操作成功',
            user: req.user,
            permissions: req.permissions ? req.permissions.filter(item => item.perms).map(item => item.perms) : [],
            roles: roles.map(item=>{
                return item.role_key
            })
        })
    })

    /**
     * @description 根据token查询菜单
     * */
    app.get('/getRouters', auth('*:*:*'), async (req, res) => {
        let rolesId = await queryAsync("SELECT * FROM `sys_user_role` WHERE `user_id` = '"+ req.id +"'")
        rolesId = rolesId.map(item=>{
            return item.role_id
        })
        let menusId
        if(req.user.user_name == "admin") {
            menusId = await queryAsync("SELECT * FROM `sys_menu`")
        } else {
            menusId = await queryAsync("SELECT * FROM `sys_role_menu` WHERE (`role_id` IN ("+ rolesId.join(',') +"))")
        }
        menusId = Array.from(new Set(menusId.map(item=>{
            return item.menu_id
        })))
        // console.log(menusId, 'menusId');
        let menuTree
        if(menusId.length != 0) {
            // console.log("SELECT * FROM `sys_menu` WHERE `menu_id` IN ("+ menusId.join(',') +") AND `status` LIKE '%0%' AND `menu_type` NOT LIKE '%F%'");
            let menus = await queryAsync("SELECT * FROM `sys_menu` WHERE `menu_id` IN ("+ menusId.join(',') +") AND `status` LIKE '%0%' AND `menu_type` NOT LIKE '%F%'")
            // console.log(menus, 'menus');
            menus = menus.map(item => {
                return {
                    component: item.component,
                    hidden: item.visible == "0" ? false : true ,
                    name: upperFirstLetter(item.path),
                    redirect: item.menu_type === 'M' ? "noRedirect" : "",
                    menuType: item.menu_type,
                    icon: item.icon,
                    path:  item.parent_id ? item.path : "/" + item.path,
                    meta: {
                        icon: item.icon,
                        title: item.menu_name,
                        noCache: item.is_cache,
                    },
                    id: item.menu_id,
                    parentId: item.parent_id,
                    sort: item.order_num
                }
            })
            
            menuTree = await handleTree(menus)
        }
        // console.log(menuTree, 'menuTree');
        res.send({
            code: 200,
            message: '操作成功',
            data: menuTree ? menuTree : []
        })
    })

    /**
     * @description 查询用户个人资料
     * */
    app.get('/profile', auth('*:*:*'), async(req, res) => {
        res.send({
            code: 200,
            message: '操作成功',
            data: req.user
        })
    })

    /**
     * @description 根据主键id修改用户个人资料
     * @param req.body {Object} 数据
     * */
     app.put('/profile', auth('*:*:*'), async (req, res) => {
        await User.findByIdAndUpdate(req.body._id, req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 修改个人密码
     * */
     app.put('/profile/updatePwd', auth('*:*:*'), async (req, res) => {
        const {oldPassword, newPassword} = req.body
        const user = await User.findById(req.user._id).select('password')
        const valid = require('bcrypt').compareSync(oldPassword, user.password)
        assert(valid, 422, '旧密码不正确，请重新输入旧密码。')
        await User.findByIdAndUpdate(req.user._id, {password: newPassword})

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 添加信息
     * @param req.body {Object} 数据
     * */
    app.post('/user', auth('system:user:insert'), async (req, res) => {
        const {userName} = req.body
        const user = await User.findOne({userName})
        assert(!user, 500, '该用户信息已经存在，请不要重复添加。')
        await User.create(req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 批量删除
     * @param req.body {Array} 信息的主键id的集合
     * */
    app.delete('/user', auth('system:user:delete'), async (req, res) => {
        await User.deleteMany({_id: {$in: req.body}})

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 根据userName修改信息
     * @param userName {String} 编号
     * */
    app.put('/user/:userName', auth('system:user:update'), async (req, res) => {
        await User.findOneAndUpdate({userName: req.params.userName}, req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 重置密码
     * */
    app.put('/user/reset/:id', auth('system:user:update'), async (req, res) => {
        await User.findByIdAndUpdate(req.params.id, req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 测试*****
     * */
    app.get('/tableList', async (req, res) => {
        let data = [
            [ 
                { value: "Issue 1" },
                { value: "0x51b8…14bE8f" },
                { value: "xxxxxxxxxx" },
                { value: "50,0001", imageFront: "/images/annularPieIcon.svg", size: "20x20" },
                { value: "1,000", imageFront: "/images/Component.svg", size: "20x20" },
                { value: "2023.10.05 18:50:00", class: "darkText" },
                { value: "xxxxxxxxxx View", imageBehind: "/images/Link.svg", class: "darkText" }
            ],
            [ 
                { value: "Issue 1" },
                { value: "0x51b8…14bE8f" },
                { value: "xxxxxxxxxx" },
                { value: "50,0001", imageFront: "/images/annularPieIcon.svg", size: "20x20" },
                { value: "1,000", imageFront: "/images/Component.svg", size: "20x20" },
                { value: "2023.10.05 18:50:00", class: "darkText" },
                { value: "xxxxxxxxxx View", imageBehind: "/images/Link.svg", class: "darkText" }
            ],
            [ 
                { value: "Issue 2" },
                { value: "0x51b8…14bE8f" },
                { value: "xxxxxxxxxx" },
                { value: "50,0001", imageFront: "/images/annularPieIcon.svg", size: "20x20" },
                { value: "1,000", imageFront: "/images/Component.svg", size: "20x20" },
                { value: "2023.10.05 18:50:00", class: "darkText" },
                { value: "xxxxxxxxxx View", imageBehind: "/images/Link.svg", class: "darkText" }
            ],
            [ 
                { value: "Issue 2" },
                { value: "0x51b8…14bE8f" },
                { value: "xxxxxxxxxx" },
                { value: "50,0001", imageFront: "/images/annularPieIcon.svg", size: "20x20" },
                { value: "1,000", imageFront: "/images/Component.svg", size: "20x20" },
                { value: "2023.10.05 18:50:00", class: "darkText" },
                { value: "xxxxxxxxxx View", imageBehind: "/images/Link.svg", class: "darkText" }
            ],
            [ 
                { value: "Issue 3" },
                { value: "0x51b8…14bE8f" },
                { value: "xxxxxxxxxx" },
                { value: "50,0001", imageFront: "/images/annularPieIcon.svg", size: "20x20" },
                { value: "1,000", imageFront: "/images/Component.svg", size: "20x20" },
                { value: "2023.10.05 18:50:00", class: "darkText" },
                { value: "xxxxxxxxxx View", imageBehind: "/images/Link.svg", class: "darkText" }
            ],
            
        ]
        res.send({
            code: 200,
            message: '操作成功',
            data: data
        })
    })

}

// 查找树结构里的某个节点
async function getDepartmentById(list, id) {
    //判断list是否是数组
    if (!list instanceof Array) {
        return null
    }
    //遍历数组
    for (let i in list) {
        let item = list[i]
        if (item.deptCode === id) {
            return item
        } else {
            //查不到继续遍历
            if (item.children && item.children.length) {
                let value = await getDepartmentById(item.children, id)
                //查询到直接返回
                if (value) {
                    return value
                }
            }
        }
    }
}

// 返回树结构里的code集合
async function returnCode(data) {
    let arr = []
    queryNode(data)
    function queryNode(data) {
        if (data._id) {
            arr.push(data._id)
        }
        if (data.children && data.children.length) {
            for (let i in data.children) {
                const item = data.children[i]
                queryNode(item)
            }
        }
    }
    return arr
}