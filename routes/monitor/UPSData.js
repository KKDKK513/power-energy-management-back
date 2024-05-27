module.exports = app => {
  // const { handleAndReadMessages } = require('../../routes/getData/ups')
  const auth = require('../../middleWares/auth')
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const message232_1 = [
    [0x7e, 0x30, 0x30, 0x50, 0x30, 0x30, 0x33, 0x53, 0x54, 0x42]
  ];
  const message232_2 = [
    [0x7e, 0x30, 0x30, 0x50, 0x30, 0x30, 0x33, 0x53, 0x54, 0x49]
  ]
  const message232_3 = [
    [0x7e, 0x30, 0x30, 0x50, 0x30, 0x30, 0x33, 0x53, 0x54, 0x4f]
  ]
  const message232_4 = [
    [0x7e, 0x30, 0x30, 0x50, 0x30, 0x30, 0x33, 0x53, 0x54, 0x41]
  ]
  const message232Format_1 = message232_1.map(arr => Buffer.from(arr));
  const message232Format_2 = message232_2.map(arr => Buffer.from(arr));
  const message232Format_3 = message232_3.map(arr => Buffer.from(arr));
  const message232Format_4 = message232_4.map(arr => Buffer.from(arr));
  /**
   * @description 查询信息
   * */
  app.get('/monitor/getUPSData1', auth('*:*:*'), async (req, res) => {
    try {
      console.log('/monitor/getUPSData1');
      // const ups1 = await handleAndReadMessages(message232Format_1);
      const ups1 = ['00D0220;0;0;0;0;0;0;0;0;1;0;0;0;0;1']
      console.log('ups1', ups1);
      res.send({
        code: 200,
        message: '操作成功',
        data: ups1
      });
    } catch (e) {
      res.send({
        code: 201,
        msg: e.message
      });
    }
  });
  app.get('/monitor/getUPSData2', auth('*:*:*'), async (req, res) => {
    try {
      console.log('/monitor/getUPSData2');
      // const ups2 = await handleAndReadMessages(message232Format_2);
      const ups2 = ['00D0220;0;1;0;22;0;414;32;28;100;9999;9999']
      console.log('ups2', ups2);
      res.send({
        code: 200,
        message: '操作成功',
        data: ups2
      });
    } catch (e) {
      res.send({
        code: 201,
        msg: e.message
      });
    }
  });
  app.get('/monitor/getUPSData3', auth('*:*:*'), async (req, res) => {
    try {
      console.log('/monitor/getUPSData3');
      // const ups3 = await handleAndReadMessages(message232Format_3);
      const ups3 = ['00D0323;600;2200;220;220;600;2200;220;220;600;220;5;5;5;5;220']
      console.log('ups3', ups3);
      res.send({
        code: 200,
        message: '操作成功',
        data: ups3
      });
    } catch (e) {
      res.send({
        code: 201,
        msg: e.message
      });
    }
  });
  app.get('/monitor/getUPSData4', auth('*:*:*'), async (req, res) => {
    try {
      console.log('/monitor/getUPSData4');
      // const ups4 = await handleAndReadMessages(message232Format_4);
      const ups4 = ['00D0490;600;3;2200;10;220;5;2200;10;225;5;2200;10;223;5C4']
      console.log('ups4', ups4);
      res.send({
        code: 200,
        message: '操作成功',
        data: ups4
      });
    } catch (e) {
      res.send({
        code: 201,
        msg: e.message
      });
    }
  });
}
