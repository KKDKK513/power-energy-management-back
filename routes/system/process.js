module.exports = app => {
  const assert = require('http-assert')
  const Process = require('../../models/system/Process')
  const auth = require('../../middleWares/auth')

  /**
   * @description 新增审批流
   * */
  app.post('/process', auth('system:definition:insert'), async (req, res) => {
    const {code} = req.body
    const process = await Process.findOne({code})
    assert(!process, 422, '此审批流编码已被使用，请更换后重试。')
    await Process.create(req.body)

    res.send({
      code: 200,
      message: '操作成功'
    })
  })

  /**
   * @description 查询审批流列表
   * */
  app.get('/process', auth('system:definition:list'), async (req, res) => {
    const {pageSize, pageNum, status, name} = req.query
    const regexp = new RegExp(name,'i')
    const query = {
      $or: [{name: {$regex: regexp}}],
    }
    if (status) query.status = status
    const total = await Process
      .find(query)
      .countDocuments()
    const data = await Process
      .find(query)
      .skip((pageNum - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .sort({updateTime: -1})

    res.send({
      code: 200,
      message: '操作成功',
      data,
      total
    })
  })

  /**
   * @description 根据审批流编码查询指定审批流
   * */
  app.get('/process/:code', auth('*:*:*'), async (req, res) => {
    const data = await Process.findOne({code: req.params.code})

    res.send({
      code: 200,
      message: '操作成功',
      data
    })
  })

  /**
   * @description 根据主键id编辑审批流信息
   * */
  app.put('/process', auth('system:definition:update'), async (req, res) => {
    const {_id: id} = req.body
    await Process.findByIdAndUpdate(id, req.body)

    res.send({
      code: 200,
      message: '操作成功'
    })
  })

  /**
   * @description 根据主键id<Array>批量删除审批流
   * */
  app.delete('/process', auth('system:definition:delete'), async (req, res) => {
    const result = await Process.deleteMany({_id: {$in: req.body}})
    assert(result['deletedCount'], 422, '删除失败，请检查参数是否有效。')

    res.send({
      code: 200,
      message: '操作成功'
    })
  })
}
