module.exports = app => {

    const assert = require('http-assert')
    const auth = require('../../middleWares/auth')
    // const Department = require('../../models/system/Department')

    /**
     * @description 查询部门列表
     * */
    app.get('/dept', auth('system:dept:list'), async (req, res) => {
        const {deptName, status} = req.query
        const regexp = new RegExp(deptName, 'i')
        const query = {
            $or: [{deptName: {$regex: regexp}}],
        }
        if (status) query.status = status
        const data = await Department
            .find(query)
            .sort({order: 1})

        res.send({
            code: 200,
            message: '操作成功',
            data
        })
    })

    /**
     * @description 查询部门下拉树
     * */
     app.get('/dept/tree', auth('*:*:*'), async (req, res) => {
        const data = await Department
            .find({status: '1'})
            .sort({order: 1})

        res.send({
            code: 200,
            message: '操作成功',
            data
        })
    })

    /**
     * @description 创建部门
     * */
    app.post('/dept', auth('system:dept:insert'), async (req, res) => {
        const {deptCode} = req.body
        const dept = await Department.findOne({deptCode})
        assert(!dept, 422, '此部门编码已被使用，请修改后重试')
        await Department.create(req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 查询部门详情
     * */
    app.get('/dept/:deptCode', auth('system:dept:detail'), async (req, res) => {
        const {deptCode} = req.params
        const data = await Department.findOne({deptCode})

        res.send({
            code: 200,
            message: '操作成功',
            data
        })
    })

    /**
     * @description 修改部门信息
     * */
    app.put('/dept', auth('system:dept:update'), async (req, res) => {
        const {_id: id} = req.body
        const dept = await Department.findById(id)
        assert(dept, 422, '编辑失败，请检查参数是否正确。')
        await Department.findByIdAndUpdate(id, req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 删除部门
     * */
    app.delete('/dept/:deptCode', auth('system:dept:delete'), async (req, res) => {
        await Department.findOneAndDelete({deptCode: req.params.deptCode})

        res.send({
            code: 200,
            message: '操作成功'
        })
    })
}