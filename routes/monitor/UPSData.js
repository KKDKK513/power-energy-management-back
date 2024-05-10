module.exports = app => {
  // const { handleAndReadMessages } = require('../../routes/getData/ups')
  const auth = require('../../middleWares/auth')
  /**
   * @description 查询信息
   * */
  app.get('/monitor/getUPSData', auth('*:*:*'), async (req, res) => {
    try {
      // const hycRes = await handleAndReadMessages()
      let hycRes = [ '00D0220;0;1;0;22;0;414;32;28;100;9999;9999',
        '00D0323;600;2200;220;220;600;2200;220;220;600;220;5;5;5;5;220',
        '00D0490;600;3;2200;10;220;5;2200;10;225;5;2200;10;223;5C4',
        '00D0220;0;0;0;;0;;;;;;0;;;;1']
      console.log('@',hycRes);
      res.send({
        code: 200,
        message: '操作成功',
        data: hycRes
        // data: {
        //   STBData: STBData,
        //   inputData: inputData,
        //   outputData: outputData,
        //   errorData: errorData,
        // }
      })
    } catch (e) {
      res.send({
        code: 201,
        msg: e.message
      })
    }
  })
}

