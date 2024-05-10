module.exports = app => {
  const auth = require('../../middleWares/auth')
  const { queryAsync } = require('../../plugins/db')
  const { sqlSelectFormat, timeFileter } = require('../../utils/tools')
  /**
   * @description 查询属性信息
   * */
  app.get('/history/getDeviceAttribute', auth('*:*:*'), async (req, res) => {
    let _params = {
      type: parseInt(req.query.type),
      name: req.query.keyWord,
      status: '0'
    }
    console.log(req, sqlSelectFormat("SELECT * FROM `device_attribute`", _params));
    // WHERE `type` = '"+ req.query.type + "' AND `name` LIKE '%"+ req.query.keyWord +"%'"
    queryAsync(sqlSelectFormat("SELECT * FROM `device_attribute`", _params)).then(queryRes => {
      let data = queryRes.map(item => {
        return {
          id: item.id,
          name: item.name,
          nameKey: item.name_key,
          type: item.type,
          strIndex: item.strIndex,
          sliceLength: item.sliceLength,
          unit: item.unit,
          status: item.status
        }
      })
      res.send({
        code: 200,
        message: '操作成功',
        data: data
      })
    })
  })


  /**
   * @description 查询历史数据
   * */
  // PCS
  app.get('/history/getPCSList', auth('*:*:*'), async (req, res) => {
    res.send({
      code: 200,
      message: '操作成功',
      data: [
        { title: 'title1', time: new Date(), atatus: 0 },
        { title: 'title2', time: new Date(), atatus: 1 },
      ]
    })
  })

  // BMS
  app.get('/history/getBMSList', auth('*:*:*'), async (req, res) => {
    // SELECT * FROM `power-test`.`bcu_h_data1` ORDER BY `create_time`
    let _params = {
      name_key: req.query.nameKey,
    }
    let _nameKey = ''
    _nameKey = req.query.nameKey.split(',').map(t => 'a' + t).join(', ')
    console.log(req.query);
    console.log("SELECT id, create_time, " + _nameKey + " FROM `bcu_h_data1` WHERE `create_time` BETWEEN '" + req.query.dateRange[0] + "' AND '" + req.query.dateRange[1] + "'  ORDER BY `create_time`");
    queryAsync("SELECT id, create_time, " + _nameKey + " FROM `bcu_h_data1` WHERE `create_time` BETWEEN '" + req.query.dateRange[0] + "' AND '" + req.query.dateRange[1] + "' ORDER BY `create_time`").then(queryRes => {
      console.log(queryRes, 'queryRes');
      let data = queryRes
      res.send({
        code: 200,
        message: '操作成功',
        data: data
    })
    }).catch(err => {
      res.send({
        code: 201,
        message: err.message
      })
    })
  })
  // EMS
  app.get('/history/getEMSList', auth('*:*:*'), async (req, res) => {
    res.send({
      code: 200,
      message: '操作成功',
      data: [
        { title: 'title1', time: new Date(), atatus: 0 },
        { title: 'title2', time: new Date(), atatus: 1 },
      ]
    })
  })
  // electricityMeter
  app.get('/history/getElectricMeterList', auth('*:*:*'), async (req, res) => {
    res.send({
      code: 200,
      message: '操作成功',
      data: [
        { title: 'title1', time: new Date(), atatus: 0 },
        { title: 'title2', time: new Date(), atatus: 1 },
      ]
    })
  })
  // dehumidification
  app.get('/history/getDehumidifierList', auth('*:*:*'), async (req, res) => {
    res.send({
      code: 200,
      message: '操作成功',
      data: [
        { title: 'title1', time: new Date(), atatus: 0 },
        { title: 'title2', time: new Date(), atatus: 1 },
      ]
    })
  })
  // fireFighting
  app.get('/history/getFireFightList', auth('*:*:*'), async (req, res) => {
    res.send({
      code: 200,
      message: '操作成功',
      data: [
        { title: 'title1', time: new Date(), atatus: 0 },
        { title: 'title2', time: new Date(), atatus: 1 },
      ]
    })
  })
  // UPS
  app.get('/history/getUPSList', auth('*:*:*'), async (req, res) => {
    res.send({
      code: 200,
      message: '操作成功',
      data: [
        { title: 'title1', time: new Date(), atatus: 0 },
        { title: 'title2', time: new Date(), atatus: 1 },
      ]
    })
  })
  // temperatureControl
  app.get('/history/getAirConditionerList', auth('*:*:*'), async (req, res) => {
    res.send({
      code: 200,
      message: '操作成功',
      data: [
        { title: 'title1', time: new Date(), atatus: 0 },
        { title: 'title2', time: new Date(), atatus: 1 },
      ]
    })
  })
}

