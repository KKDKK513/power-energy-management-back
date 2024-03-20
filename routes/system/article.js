module.exports = app => {
    const assert = require('http-assert')
    const Article = require('../../models/system/Article')
    const auth = require('../../middleWares/auth')

    /**
     * @description 获取文章列表
    * */
    app.get('/article', auth('system:article:list'), async (req, res) => {
        const {pageNum, pageSize, title, type, flow, status} = req.query
        const regexp = new RegExp(title, 'i')
        const query = {
            $or: [{title: {$regex: regexp}}]
        }
        if (type) query.type = type
        if (flow) query.flow = flow
        if (status) query.status = status
        const total = await Article
            .find(query)
            .countDocuments()
        const rows = await Article
            .find(query)
            .populate('author', 'name')
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
     * @description 获取已通过审核文章列表（不包含下架文章）,用于首页展示
     * */
    app.get('/article/list', auth('*:*:*'), async (req, res) => {
        const data = await Article
            .find({status: {$ne: '3'}, flow: '2'})
            .populate('author', 'name')

        res.send({
            code: 200,
            message: '操作成功',
            data
        })
    })

    /**
     * @description 新增文章
     * */
    app.post('/article', auth('system:article:insert'), async (req, res) => {
        const {_id: id} = req.user
        req.body.author = id
        await Article.create(req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 查询文章详情
     * */
    app.get('/article/:id', auth('system:article:detail'), async (req, res) => {
        const data = await Article.findById(req.params.id)

        res.send({
            code: 200,
            message: '操作成功',
            data
        })
    })

    /**
     * @description 修改文章内容
     * */
    app.put('/article', auth('system:article:update'), async (req, res) => {
        const {_id: id} = req.body
        const article = await Article.findById(id)
        assert(article, 422, '编辑失败，请检查参数是否有效。')
        await Article.findByIdAndUpdate(id, req.body)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 删除文章
     * */
    app.delete('/article', auth('system:article:delete'), async (req, res) => {
        const result = await Article.deleteMany({_id: {$in: req.body}})
        assert(result['deletedCount'], 422, '删除失败，请检查参数是否有效。')

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 审核文章-通过
     * */
    app.put('/article/audit', auth('system:article:audit'), async (req, res) => {
        const {_id: id, advice} = req.body
        const article = await Article.findById(id)
        const flow = article.flow === '1'
        assert(flow, 422, '当前文章审核状态异常，请联系管理员。')
        article.flow = '2'
        article.auditor = req.user._id
        article.advice = advice
        await Article.findByIdAndUpdate(id, article)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })

    /**
     * @description 审核文章-退回
     * */
    app.put('/article/refuse', auth('system:article:audit'), async (req, res) => {
        const {_id: id, advice} = req.body
        const article = await Article.findById(id)
        const flow = article.flow === '1'
        assert(flow, 422, '当前文章审核状态异常，请联系管理员。')
        article.flow = '3'
        article.auditor = req.user._id
        article.advice = advice
        await Article.findByIdAndUpdate(id, article)

        res.send({
            code: 200,
            message: '操作成功'
        })
    })
}