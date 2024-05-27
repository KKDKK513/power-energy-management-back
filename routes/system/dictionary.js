module.exports = app => {

  const assert = require('http-assert')
  // const Dictionary = require('../../models/system/Dictionary')
  // const DictionaryData = require('../../models/system/DictionaryData')
  const auth = require('../../middleWares/auth')
  const { queryAsync } = require('../../plugins/db')
  const { timeFileter } = require('../../utils/tools')
  /**
   * @description 新增字典类型
   * */
  app.post('/dictType', auth('system:dict:insert'), async (req, res) => {
    const {dictType} = req.body
    const dict = await Dictionary.findOne({dictType})
    assert(!dict, 422, '该字典类型已经存在，请不要重复添加。')
    await Dictionary.create(req.body)

    res.send({
      code: 200,
      message: '操作成功'
    })
  })

  /**
   * @description 获取字典类型列表（获取不包含停用的字典类型）
   * */
  app.get('/dictType', auth('system:dict:list'), async (req, res) => {
    const {pageNum, pageSize} = req.query
    const query = {
      status: {$ne: '0'}
    }
    const total = await Dictionary.find(query).countDocuments()
    const rows = await Dictionary.find(query).skip((pageNum - 1) * parseInt(pageSize)).limit(parseInt(pageSize))

    res.send({
      code: 200,
      message: '操作成功',
      rows,
      total
    })
  })

  /**
   * @description 获取字典类型列表(获取所有字典类型)
   * */
  app.get('/dictType/all', auth('system:dict:list'), async (req, res) => {
    const {pageNum, pageSize, keywords, status} = req.query
    const regexp = new RegExp(keywords,'i')
    const query = {
      $or: [{dictName: {$regex: regexp}}, {dictType: {$regex: regexp}}, {remark: {$regex: regexp}}],
    }
    if (status) query.status = status
    const total = await Dictionary
      .find(query)
      .countDocuments()
    const rows = await Dictionary
      .find(query)
      .skip((pageNum - 1) * parseInt(pageSize))
      .limit(parseInt(pageSize))
      .sort({createTime: -1})

    res.send({
      code: 200,
      message: '操作成功',
      rows,
      total
    })
  })

  /**
   * @description 新增字典数据
   * */
  app.post('/dictData', auth('system:dict:insert'), async (req, res) => {
    const {dictType, dictValue} = req.body
    const dict = await Dictionary.findOne({dictType})
    assert(dict, 422, '该字典类型不存在，请创建后使用。')
    const data = await DictionaryData.findOne({dictType, dictValue})
    assert(!data, 422, '该字典数据键值已经存在，请不要重复使用。')
    await DictionaryData.create(req.body)

    res.send({
      code: 200,
      message: '操作成功'
    })
  })

  /**
   * @description 根据字典类型查询详情数据
   * */
  app.get('/system/dict/data/type/:dictType', auth('system:dict:detail'), async (req, res) => {
    let dictData = await queryAsync("SELECT * FROM `sys_dict_data` WHERE `dict_type` LIKE '"+ req.params.dictType + "'")
    // console.log(dictData, 'dictData');
    let data = dictData.map(item => {
      return {
        createBy: item.create_by,
        createTime: timeFileter(item.create_time),
        remark: item.remark,
        dictCode: item.dict_code,
        dictSort: item.dict_sort,
        dictLabel: item.dict_label,
        dictValue: item.dict_value,
        dictType: item.dict_type,
        default: item.is_default == "N" ? false : true,
        status: item.status,
      }
    })
    res.send({
      code: 200,
      message: '操作成功',
      data
    })
  })

  /**
   * @description 修改字典类型
   * */
  app.put('/dictType', auth('system:dict:update'), async (req, res) => {
    const {_id} = req.body
    const dict = await Dictionary.findOne({_id})
    assert(dict, 422, '编辑失败，请检查参数是否正确。')
    await Dictionary.findByIdAndUpdate(_id, req.body)

    res.send({
      code: 200,
      message: '操作成功',
    })
  })

  /**
   * @description 根据dictType<Array>批量删除字典类型
   * @description 删除字典类型时，该类型对应的字典数据也会被删除
   * */
  app.delete('/dictType', auth('system:dict:delete'), async (req, res) => {
    const result = await Dictionary.deleteMany({dictType: {$in: req.body}})
    assert(result['deletedCount'], 422, '删除失败，请检查参数是否有效。')
    await DictionaryData.deleteMany({dictType: {$in: req.body}})

    res.send({
      code: 200,
      message: '操作成功'
    })
  })

  /**
   * @description 根据获取字典类型获取字典数据列表（不包含停用字典数据）
   * */
  app.get('/dictData/:dictType', auth('*:*:*'), async (req, res) => {
    const query = {dictType: req.params.dictType, status: {$ne: '0'}}
    const total = await DictionaryData.find(query).countDocuments()
    const data = await DictionaryData.find(query).sort({dictSort: 1})

    res.send({
      code: 200,
      message: '操作成功',
      data,
      total
    })
  })

  /**
   * @description 根据获取字典类型获取字典数据列表(全部数据)
   * */
  app.get('/dictDataAll/:dictType', auth('system:dict:list'), async (req, res) => {
    const query = {dictType: req.params.dictType}
    const total = await DictionaryData.find(query).countDocuments()
    const data = await DictionaryData.find(query).sort({dictSort: 1})

    res.send({
      code: 200,
      message: '操作成功',
      data,
      total
    })
  })

  /**
   * @description 根据字典数据主键id查询详情
   * */
  app.get('/dictDataById/:id', auth('system:dict:detail'), async (req, res) => {
    const data = await DictionaryData.findOne({_id: req.params.id})

    res.send({
      code: 200,
      message: '操作成功',
      data
    })
  })

  /**
   * @description 修改字典数据
   * */
  app.put('/dictData', auth('system:dict:update'), async (req, res) => {
    const data = await DictionaryData.findOneAndUpdate({_id: req.body._id}, req.body)
    assert(data, 422, '编辑失败，请检查参数是否有效。')

    res.send({
      code: 200,
      message: '操作成功',
    })
  })

  /**
   * @description 修改字典默认状态，同类型下只能有一个默认值
   * */
  app.put('/dictData/change', auth('system:dict:update'), async (req, res) => {
    const {dictType, _id: id} = req.body
    await DictionaryData.updateMany({dictType}, {isDefault: '0'})
    await DictionaryData.findByIdAndUpdate(id, req.body)

    res.send({
      code: 200,
      message: '操作成功',
    })
  })


  /**
   * @description 根据主键id<Array>批量删除字典数据
   * */
  app.delete('/dictData', auth('system:dict:delete'), async (req, res) => {
    const result = await DictionaryData.deleteMany({_id: {$in: req.body}})
    assert(result['deletedCount'], 422, '删除失败，请检查参数是否有效。')

    res.send({
      code: 200,
      message: '操作成功'
    })
  })
}
