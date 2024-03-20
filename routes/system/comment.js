module.exports = app => {
    const assert = require('http-assert')
    const Comment = require('../../models/system/Comment')
    const auth = require('../../middleWares/auth')

    /**
     * @description 发表评论
     * */
    app.post('/comment', auth('*:*:*'), async (req, res) => {
        await Comment.create(req.body)

        res.send({
            code: 200,
            article: '操作成功'
        })
    })

    /**
     * @description 获取评论列表
     * */
    app.get('/comment', auth('*:*:*'), async (req, res) => {
        const {pageNum, pageSize, content} = req.body
        const regexp = new RegExp(content, 'i')
        const query  = {
            $or: [{content: {$regex: regexp}}]
        }
        const total = await Comment.find(query).countDocuments()
        const rows = await Comment.find(query).populate('article', 'title').populate('person', 'name').skip((pageNum - 1) * parseInt(pageSize)).limit(parseInt(pageSize))

        res.send({
            code: 200,
            article: '操作成功',
            total,
            rows
        })
    })

    /**
     * @description 获取某文章下的评论列表
     * */
    app.get('/comment/:article', auth('*:*:*'), async (req, res) => {
        const {article} = req.params
        const data = await Comment.find({article, status: '1'})

        res.send({
            code: 200,
            article: '操作成功',
            data
        })
    })

    /**
     * @description 修改评论内容
     * */
    app.put('/comment', auth('*:*:*'), async (req, res) => {
        const {_id: id} = req.body
        await Comment.findByIdAndUpdate(id, req.body)

        res.send({
            code: 200,
            article: '操作成功'
        })
    })

    /**
     * @description 删除评论
     * */
    app.delete('/comment', auth('*:*:*'), async (req, res) => {
        const result = await Comment.deleteMany({_id: {$in: req.body}})
        assert(result['deletedCount'], 422, '删除失败，请检查参数是否有效。')

        res.send({
            code: 200,
            message: '操作成功'
        })
    })
}