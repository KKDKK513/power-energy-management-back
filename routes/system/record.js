module.exports = app => {

    const assert = require('http-assert')
    const Record = require('../../models/system/Record')
    const auth = require('../../middleWares/auth')

    /**
     * @description 查询日志列表
     * */
    app.get('/record', auth('system:record:list'), async (req, res) => {
        const {pageNum, pageSize, date, type} = req.query
        const query = {}
        if (type) query.type = type
        const total = await Record
            .find(query)
            .countDocuments()
        const rows = await Record
            .find(query)
            .populate('user', {name: 1, userName: 1})
            .skip((pageNum - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .sort({createTime: -1})

        res.send({
            code: 200,
            message: '操作成功',
            total,
            rows
        })
    })

    /**
     * @description 查询当前用户日志
     * */
    app.get('/record/:id', auth('system:record:list'), async (req, res) => {
        const data = await Record
            .find({user: req.params.id})
            .populate('user', {name: 1, userName: 1})
            .sort({createTime: -1})

        res.send({
            code: 200,
            message: '操作成功',
            data
        })
    })
}