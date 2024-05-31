module.exports = app => {
  // const { handleAndReadMessages } = require('../../routes/getData/air_conditioner')
  const auth = require('../../middleWares/auth')
  /**
   * @description 查询信息
   * */
  app.get('/monitor/getTemperatureData', auth('*:*:*'), async (req, res) => {
    try {
      // const hycRes = await handleAndReadMessages()
      // let resultArr = hycRes
      let resultArr = [
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020000b99c', '0103020000b99c', '0103020001b99c',
        '0103020000b99c', '0103020001b99c', '0103020000b99c', '0103020001b99c',
        '0103020001b99c', '0103020000b99c', '0103020001b99c', '0103020000b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020001b99c', '0103020001b99c', '0103020001b99c', '0103020001b99c',
        '0103020000b99c', '0103020001b99c', '0103020000b99c', '0103020001b99c',
        '0103020000b99c', '0103020001b99c', '0103020000b99c', '0103020001b99c',
      ] 
      res.send({
        code: 200,
        message: '操作成功',
        data: resultArr
      })
    } catch (e) {
      res.send({
        code: 201,
        message: e.message
      })
    }
  })
}

