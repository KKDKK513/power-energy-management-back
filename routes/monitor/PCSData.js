module.exports = app => {
  // const { handleAndReadMessages, processData } = require('../../routes/getData/pcs')
  const auth = require('../../middleWares/auth')
  /**
   * @description 查询实时信息
   * */
  app.get('/monitor/getPCSData', auth('*:*:*'), async (req, res) => {
    try {
      // const hycRes = await handleAndReadMessages()
      // let resultArr = hycRes
      let resultArr = [
        '0103020f9bfc1f', '0103020f957ddb', '0103020f817dd4', '01030208fbfe07',
        '0103020904bfd7', '01030208f23e01', '010302000d7981', '010302000ff840',
        '010302000cb841', '01030200097842', '010302000bf983', '010302000a3843',
        '010302139174d8', '010302ffffb844', '010302ffffb844', '010302fff9b844',
        '0103020000b844', '0103020000b844', '0103020000b844', '0103020000b844',
        '0103020000b844', '0103020000b844', '0103020000b844', '0103020000b844',
        '0103020000b844', '0103020000b844', '0103020064b9af', '0103020000b844',
        '0103020000b844', '0103020000b844', '010302ffe5383f', '010302fff8f836',
        '0103020000b844', '0103020000b844', '0103020040b9b4', '01030200be3834',
        '01030200ccb811', '01030200bff9f4', '01030200017984', '01030200057847',
        '010302000a3843', '0103020000b844', '0103020003f845', '0103020004b987',
        '0103020000b844', '0103020064b9af', '0103020064b9af', '0103020064b9af',
        '0103020000b844', '010302003bf997', '0103020000b844', '0103020000b844',
        '0103020000b844', '0103020059787e', '0103020000b844', '0103020000b844',
        '0103020000b844', '010302003cb855', '0103020000b844', '0103020000b844',
        '0103020000b844', '010302005239b9', '0103020000b844', '0103020000b844',
        '0103020000b844', '0103020000b844', '01030200017984', '01030200017984',
        '0103020000b844', '0103020000b844', '0103020000b844', '0103020000b844',
        '0103020000b844', '0103020000b844', '0103021fd631ea', '0103021770b650',
        '0103020640ba14', '0103021fd631ea', '0103021770b650', '01030206d63a7a',
        '0103020a78bec6', '01030206a4ba5f', '01030206723bc1', '01030203b63902',
        '0103022198a1be', '0103022198a1be', '01030204b0bb30', '01030200fa3807',
        '0103021ce8b0ca', '0103020258b8de', '0103020000b844', '0103020000b844',
        '0103020000b844', '01030200017984', '0103020060b86c', '01030200017984',
        '0103020060b86c', '01030200b4b833', '010302af0fb844', '01030af0f1b844',
        '010302af0fb844', '010302af0f7984', '010302af0fb86c', '010302af0f7984',
        '010302af0fb86c', '010302af0fb833', '0103021111b844'
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
	   *    * @description 参数设置
	   *       * */
	  app.post('/monitor/pcsParamsSetting', auth('*:*:*'), async (req, res) => {
		      try {
			            for (i in req.body) {
					            processData({ address: `0x${i.slice(1)}`, data: req.body[i] })
					            console.log({address: `0x${i.slice(1)}`, data: req.body[i]});
					          }
			            res.send({
					            code: 200,
					            message: '操作成功'
					          })
			          } catch (e) {
					        res.send({
							        code: 201,
							        message: e.msg
							      })
					      }
		    })
}


