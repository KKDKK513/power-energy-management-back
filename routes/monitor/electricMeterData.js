module.exports = app => {
  // const { handleAndReadMessages } = require('../../routes/getData/ele')
  const auth = require('../../middleWares/auth')
  /**
   * @description 查询信息
   * */
  app.get('/monitor/getelectricMeterData', auth('*:*:*'), async (req, res) => {
    try{
      // const hycRes = await handleAndReadMessages()
      // let resultArr = hycRes
      let resultArr = [
        '0103020917fe1a', '010302090e3fd0', '01030209023fd5',
        '0103020000b844', '0103020000b844', '0103020015798b',
        '0103020000b844', '0103020000b844', '010302ffd0f828',
        '010302ffcfb9e0', '0103020000b844', '0103020000b844',
        '01030200057847', '01030200057847', '0103020000b844',
        '0103020000b844', '01030200317990', '01030200317990',
        '0103020000b844', '0103020000b844', '010302fc1e794c',
        '010302fc1fb88c', '010302138974d2', '0103020fb57c03',
        '0103020fa4bc0f', '0103020fabfc0b', '0103020015798b',
        '0103020008b982', '0103020bb8bf06', '0103020000b844',
        '0103020000b844', '01030200017984', '01030200017984',
        '0103020000b844', '0103020300b8b4', '01030205023ad5',
        '0103021e07f026', '010302031e38bc', '0103020b023eb5',
        '01030200117848', '0103020300b8b4', '0103021504b717',
        '0103020016398a', '0103020000b844', '0103020000b844',
        '0103020000b844', '0103020000b844', '0103020000b844',
        '0103020000b844', '0103020000b844', '0103020000b844',
        '0103020000b844', '0103020000b844', '0103020000b844',
        '0103020000b844'
      ] 
      res.send({
        code: 200,
        message: '操作成功',
        data: resultArr
      })
    } catch(e) {
      res.send({
        code: 201,
        message: e
      })
    }
  })
}