module.exports = app => {

    const assert = require('http-assert')
    const { handleTree,
            upperFirstLetter,
            sqlSelectFormat,
            timeFileter,
            sqlUpdateFormat,
            sqlInsertFormat,
            sqlDelFormat
            } = require('../../utils/tools')
    const auth = require('../../middleWares/auth')
    const { queryAsync } = require('../../plugins/db')


    /**
     * @description 获取菜单树
     * */
    app.get('/system/menu/treeselect', auth('*:*:*'), async (req, res) => {
        queryAsync("SELECT * FROM `sys_menu`").then(menuRes => {
            let menus = menuRes.map(item => {
                return {
                    component: item.component,
                    hidden: item.visible == "0" ? false : true ,
                    name: upperFirstLetter(item.path),
                    redirect: item.menu_type === 'M' ? "noRedirect" : "",
                    menuType: item.menu_type,
                    path:  item.parent_id ? item.path : "/" + item.path,
                    title: item.menu_name,
                    icon: item.icon,
                    id: item.menu_id,
                    parentId: item.parent_id,
                }
            })
            // console.log(menus)
            const tree = handleTree(menus)
            res.send({
                code: 200,
                message: '操作成功',
                data: tree
            })
        }).catch(e => {
            res.send({
                code: 200,
                message: e
            })
        })
    })

    /**
     * @description 根据roleId 查询用户菜单id
     * */
    app.get('/system/menu/roleMenuTreeselect/:roleId', auth('*:*:*'), async (req, res) => {
        const {roleId} = req.params
        console.log(roleId);
        let promise1 = queryAsync(sqlSelectFormat("SELECT * FROM `sys_role_menu`", { role_id:  roleId}))
        let promise2 = queryAsync("SELECT * FROM `sys_menu`")
        // .then(menuRes => {
        //     let menus = menuRes.map(item => {
        //         return {
        //             component: item.component,
        //             hidden: item.visible == "0" ? false : true ,
        //             name: upperFirstLetter(item.path),
        //             redirect: item.menu_type === 'M' ? "noRedirect" : "",
        //             menuType: item.menu_type,
        //             path:  item.parent_id ? item.path : "/" + item.path,
        //             title: item.menu_name,
        //             icon: item.icon,
        //             id: item.menu_id,
        //             parentId: item.parent_id,
        //         }
        //     })
        //     // console.log(menus)
        //     const tree = handleTree(menus)
        //     res.send({
        //         code: 200,
        //         message: '操作成功',
        //         data: tree
        //     })
        // }).catch(e => {
        //     res.send({
        //         code: 200,
        //         message: e
        //     })
        // })
        Promise.all([promise1, promise2]).then(allRes => {
            console.log(allRes);

            let menusId = []
            let menus = []
            
            if(allRes[0].length != 0){
                menusId = allRes[0].map(item => {
                    return item.menu_id
                })
            }
            if(allRes[1].length != 0){
                menus = allRes[1].map(item => {
                    return {
                        component: item.component,
                        hidden: item.visible == "0" ? false : true ,
                        name: upperFirstLetter(item.path),
                        redirect: item.menu_type === 'M' ? "noRedirect" : "",
                        menuType: item.menu_type,
                        path:  item.parent_id ? item.path : "/" + item.path,
                        title: item.menu_name,
                        icon: item.icon,
                        id: item.menu_id,
                        parentId: item.parent_id,
                    }
                })
            }
            const tree = menus.length > 0 ? handleTree(menus) : []
            console.log(tree, menusId)
            res.send({
                code: 200,
                message: '操作成功',
                menus: tree,
                menusId
            })
        }).catch(e=>{
            res.send({
                code: 201,
                message: e
            })
        })
    })


    /**
     * @description 查询菜单列表
     * */
    app.get('/system/menu/list', auth('system:menu:list'), async (req, res) => {
        const { pageNum, pageSize, status, menuName } = req.query
        let params = {
            menu_name: menuName,
            status,
        }
        queryAsync(sqlSelectFormat("SELECT * FROM `sys_menu`", params)).then(queryRes => {
            // console.log(queryRes, 'queryRes');
            let _queryRes = queryRes.map(item =>{
                return {
                    menuId: item.menu_id,
                    menuName: item.menu_name,
                    parentId: item.parent_id,
                    orderNum: item.order_num,
                    path: item.path,
                    component: item.component,
                    isCache: item.is_cache,
                    menuType: item.menu_type,
                    visible: item.visible,
                    status: item.status,
                    perms: item.perms,
                    icon: item.icon,
                    isFrame: item.is_frame,
                    createTime: timeFileter(item.create_time),
                    remark: item.remark,
                  }
            })
            res.send({
                code: 200,
                message: '操作成功',
                data: _queryRes
            })
        }).catch(err => {
            res.send({
                code: 201,
                message: err.message,
            })
        })
        
    })


    /**
     * @description 修改菜单信息
     **/
    app.post('/system/menu/update', auth('system:menu:update'), async (req, res) => {
        let data = {
            status: req.body.status,
            menu_name: req.body.menuName,
            visible: req.body.visible,
            remark: req.body.remark,
            component: req.body.component,
            menu_name: req.body.menuName,
            path: req.body.path,
            icon: req.body.icon,
            parent_id: req.body.parentId,
            order_num: req.body.orderNum,
            is_cache: req.body.isCache,
            menu_type: req.body.menuType,
            is_frame: req.body.isFrame
        }
        queryAsync(sqlUpdateFormat("UPDATE `sys_menu`", data, { menu_id:req.body.menuId })).then(queryRes => {
            res.send({
                code: 200,
                message: '操作成功',
            })
        }).catch(err => {
            res.send({
                code: 201,
                message: err.message,
            })
        })
    })

    /**
     * @description 新增菜单
     * */
    app.post('/system/menu/add', auth('system:menu:insert'), async (req, res) => {
        
        let data = {
            status: req.body.status,
            menu_name: req.body.menuName,
            visible: req.body.visible,
            remark: req.body.remark,
            component: req.body.component,
            menu_name: req.body.menuName,
            path: req.body.path,
            icon: req.body.icon,
            parent_id: req.body.parentId,
            order_num: req.body.orderNum,
            is_cache: req.body.isCache,
            menu_type: req.body.menuType,
            is_frame: parseInt(req.body.isFrame)
        }
        // console.log(sqlInsertFormat("INSERT INTO `sys_menu`", data));
        queryAsync(sqlInsertFormat("INSERT INTO `sys_menu`", data)).then(queryRes => {
            res.send({
                code: 200,
                message: '操作成功',
            })
        }).catch(err => {
            res.send({
                code: 201,
                message: err.message,
            })
        })
    })

    /**
     * @description 删除菜单信息
     * */
    app.post('/system/menu/delete', auth('system:menu:delete'), async (req, res) => {
        let params = {
            parent_id: req.body.menuId
        }
        queryAsync(sqlSelectFormat("SELECT * FROM `sys_menu`", params)).then(queryRes => {
            console.log(queryRes, 'queryRes');
            if(queryRes.length > 0) {
                res.send({
                    code: 201,
                    message: '改菜单包含子项，无法删除'
                })
            } else {
                queryAsync(sqlDelFormat("DELETE FROM `sys_menu`", { menu_id: req.body.menuId })).then(queryRes => {
                    res.send({
                        code: 200,
                        message: '操作成功',
                    })
                }).catch(err => {
                    res.send({
                        code: 201,
                        message: err.message,
                    })
                })
            }
        }).catch(err => {
            res.send({
                code: 201,
                message: err.message
            })
        })

        
    })
}