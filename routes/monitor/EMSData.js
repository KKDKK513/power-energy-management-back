module.exports = app => {
  const auth = require('../../middleWares/auth')
  /**
   * @description 查询信息
   * */
  app.get('/monitor/getEMSData', auth('*:*:*'), async (req, res) => {
    res.send({
      code: 200,
      message: '操作成功',
      data: {
        value1: 'value1',
        value2: 'value2',
      }
    })
  })
}

