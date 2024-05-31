module.exports = app => {
  const auth = require('../../middleWares/auth')
  const fs = require('fs');
  const path = require('path');
  /**
   * @description 查询历史数据
   * */
  app.post('/strategy/controlBaseInfo', auth('*:*:*'), async (req, res) => {
    console.log(req);
    console.log(req.body);
    res.send({
      code: 200,
      message: '操作成功',
      data: [
        { title: 'title1', time: new Date(), atatus: 0 },
        { title: 'title2', time: new Date(), atatus: 1 },
      ]
    })
  })

  app.post('/strategy/changeStrategy', auth('*:*:*'), async (req, res) => {
    console.log(req.body);
    const relativePath = '../../plugins/time.txt';
    const filePath = path.join(__dirname, relativePath);
    let _targetTime = fs.readFileSync(filePath);
    _targetTime = JSON.parse(_targetTime)
    let _data = {
      ...req.body,
      shouldContinuePlan: _targetTime.shouldContinuePlan
    }
    console.log(_data, '_data');
    fs.writeFileSync(filePath,JSON.stringify(_data)); //写入
    res.send({
      code: 200,
      message: '操作成功'
    })
  })

  app.get('/strategy/getStrategy', auth('*:*:*'), async (req, res) => {
    const relativePath = '../../plugins/time.txt';
    const filePath = path.join(__dirname, relativePath);
    let _targetTime = fs.readFileSync(filePath);
    _targetTime = JSON.parse(_targetTime)
    res.send({
      code: 200,
      message: '操作成功',
      data: _targetTime
    })
  })
}