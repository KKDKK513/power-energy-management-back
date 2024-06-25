module.exports = app => {
  const auth = require('../../middleWares/auth')
  /**
   * @description 查询信息
   * */
  app.get('/dashboard/getDashboardData', auth('*:*:*'), async (req, res) => {
    try {
      let resultObj = {
        temperature: 20 + Math.floor(Math.random() * 10) + 1,
        humidity: 20 + Math.floor(Math.random() * 10) + 1,
        PCSpower: 20 + Math.floor(Math.random() * 10) + 1,
        BMSpower: 20 + Math.floor(Math.random() * 10) + 1,
        SOC: 20 + Math.floor(Math.random() * 10) + 1,
        income: 400 + Math.floor(Math.random() * 10) + 1,
        dayChargingNum: 400 + Math.floor(Math.random() * 10) + 1,
        totalChargingNum: 400 + Math.floor(Math.random() * 10) + 1,
        dayDischargingNum: 400 + Math.floor(Math.random() * 10) + 1,
        totalDischargingNum: 400 + Math.floor(Math.random() * 10) + 1,
      }
      res.send({
        code: 200,
        message: '操作成功',
        data: resultObj
      })
    } catch (e) {
      res.send({
        code: 201,
        message: e.message
      })
    }
  })
  /**
   * @description 查询告警信息
   * */
  app.get('/dashboard/getDashboardAlarmData', auth('*:*:*'), async (req, res) => {
    try {
      let resultArr = [
        ['2019-07-01 19:25:00', '告警1', 'PCS'],
        ['2019-07-02 17:25:00', '告警2', 'PCS'],
        ['2019-07-03 16:25:00', '告警3', 'PCS'],
        ['2019-07-04 15:25:00', '告警4', 'BMS'],
        ['2019-07-05 14:25:00', '告警5', 'BMS'],
        ['2019-07-06 13:25:00', '告警6', '空调'],
        ['2019-07-07 12:25:00', '告警7', '空调'],
        ['2019-07-08 11:25:00', '告警8', '空调'],
        ['2019-07-09 10:25:00', '告警8', '空调'],
        ['2019-07-10 09:25:00', '告警10', 'UPS']
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

    /**
   * @description 修改Ip
   * */
    app.post('/IPChange', auth('*:*:*'), async (req, res) => {
      console.log(req);
      console.log(req.body);
      res.send({
        code: 200,
        message: '操作成功',
      })
    })
    /**
   * @description 测试连接
   * */
    app.get('/verify', async (req, res) => {
      res.send({
        code: 200,
        message: '操作成功',
      })
    })
}

