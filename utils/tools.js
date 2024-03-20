/**
 * @description 根据code和parentCode转成树结构
 * @param list {Array} 需要转换的数据
 * */
function transformTree(list) {
    const tree = []
    for (let i = 0, len = list.length; i < len; i++) {
        if (!list[i].parentCode) {
            const item = queryChildren(list[i], list)
            tree.push(item)
        }
    }
    return tree
}

function queryChildren(parent, list) {
    const children = []
    for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].parentCode === parent.menuCode) {
            const item = queryChildren(list[i], list)
            children.push(item)
        }
    }
    if (children.length) {
        parent.children = children
    }
    return parent
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
function  handleTree(data, id, parentId, children) {
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };
    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];

    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }
    // console.log(childrenListMap, 'childrenListMap');
    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }
    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }

    function isMenuAlwaysShow(menus) {
        menus.forEach(item => {
            if (item.children && item.children.length > 0) {
                const show = item.children.some(v => !v.hidden)
                if (show) item.alwaysShow = true
                else {
                    item.alwaysShow = false
                    item.hidden = true
                }
                isMenuAlwaysShow(item.children)
            } else if (item.menuType === 'M') {
                item.alwaysShow = false
                item.hidden = true
            }
        })
    }
    function sortMenu(tree) {
        tree.sort(function (a, b) {
            return a.sort - b.sort;
        });
        for(let i = 0; i< tree.length; i++) {
            if(tree[i].children) {
                sortMenu(tree[i].children)
            }
        }
    }
    isMenuAlwaysShow(tree)
    sortMenu(tree)
    return tree;
}


// 大写首字母
function upperFirstLetter(str) {
    let _str = str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
    return _str
}

// 时间格式化
function timeFileter(time) {
    const now = new Date(time); // 创建一个表示当前时间的Date对象
    const formattedTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    return formattedTime
}

// mysql传参格式化 参数若为空  则不加入查询条件 查询语句
function sqlSelectFormat(sqlStr,params) {
    let paramsArr = []
    for(let i in params) {
        if(params[i]) {
            console.log(typeof params[i], i);
            paramsArr.push("`" + i + 
            (typeof params[i] == "string" ? "` LIKE '%" + params[i] + "%' " : "` = " + params[i] )
            ) 
        }
    }
    return sqlStr + ((paramsArr.length > 0) ? ` WHERE (${paramsArr.join("AND")}) ` : "")
}

// mysql传参格式化 参数若为空  则不加入修改条件 修改语句
function sqlUpdateFormat(sqlStr, data, params) {
    // SET `status` = '0', `del_flag` = '1' WHERE `user_id` = 83
    let paramsArr = []
    let dataArr = []
    for(let i in params) {
        if(params[i]) {
            paramsArr.push(" `" + i + "` LIKE " + params[i] + " ") 
        }
    }
    for(let i in data) {
        if(data[i]) {
            dataArr.push(" `" + i + "` = '" + data[i] + "' ") 
        }
    }
    return sqlStr + ((dataArr.length > 0) ? ` SET ${dataArr.join(",")} ` : "") + ((paramsArr.length > 0) ? ` WHERE (${paramsArr.join("AND")}) ` : "")
}

// mysql传参格式化 删除语句
function sqlDelFormat(sqlStr, params) {
    // DELETE FROM `sys_user_post` WHERE `user_id` = 83 AND `post_id` = 4
    let paramsArr = []
    let dataArr = []
    for(let i in params) {
        if(params[i]) {
            paramsArr.push(" `" + i + "` " + (typeof params[i] == "string" ? "LIKE" : "= " ) + params[i] + " ") 
        }
    }
    return sqlStr + ` WHERE (${paramsArr.join("AND")}) `
}

// mysql传参格式化 新增语句 多条数据
function sqlInsertAllFormat(sqlStr, params) {
    // console.log(params, 'sqlInsertAllFormat');
    // INSERT INTO `sys_user_post` (`user_id`, `post_id`) VALUES (83, 4)
    let paramsArr = []
    let valuesArr = []
    for(let k = 0; k < params.length; k++) {
        for(let i in params[k]) {
            if(k == 0) {
                paramsArr.push("`" + i + "`")
            }
            if(!valuesArr[k]) {
                valuesArr[k] = [] 
            }

            
            valuesArr[k].push("'" + params[k][i] + "'")
            // if(params[i]) {
            //     valuesArr.push(params[i]) 
            //     paramsArr.push(i)
            // }
        }
    }
    valuesArr = valuesArr.map(item => {
        return `(${item.join(',')})`
    })
    return sqlStr + ` (${paramsArr.join(",")}) VALUES ${valuesArr.join(",")}` 
}

// mysql传参格式化 新增语句 单条数据
function sqlInsertFormat(sqlStr, params) {
    // console.log(params, 'sqlInsertAllFormat');
    // INSERT INTO `sys_user_post` (`user_id`, `post_id`) VALUES (83, 4)
    let paramsArr = []
    let valuesArr = []
    for(let i in params) {
        paramsArr.push("`" + i + "`")
        console.log(typeof params[i]);
        valuesArr.push(params[i] !== null &&  params[i] !== undefined ? 
            typeof params[i] == "string" ? "'" + params[i] + "'" : params[i]
            : "' '")
    }
    return sqlStr + ` (${paramsArr.join(",")}) VALUES (${valuesArr.join(",")})` 
}

// 数据分页
function dataPagination(data, pageSize, pageNum) {
    let stratIndex = (parseInt(pageNum) - 1)*parseInt(pageSize) 
    let endIndex = parseInt(stratIndex) + parseInt(pageSize) 
    // console.log(stratIndex, endIndex);
    return data.slice(stratIndex, endIndex);
}

function strQuot(str) {
    return "'" + str + "'" 
}

module.exports = { 
    transformTree, 
    handleTree, 
    upperFirstLetter, 
    timeFileter, 
    sqlSelectFormat, 
    sqlUpdateFormat, 
    sqlDelFormat,
    dataPagination,
    sqlInsertAllFormat,
    strQuot,
    sqlInsertFormat
}
