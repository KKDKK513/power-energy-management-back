module.exports = app => {
  const auth = require('../../middleWares/auth')
  /**
   * @description 查询历史数据
   * */
  // 基本信息
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
}