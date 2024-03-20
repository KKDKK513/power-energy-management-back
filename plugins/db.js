const mysql = require("mysql2");
const dbConfig = require("./config/db.config.js");

var pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});
module.exports = pool;
// 查询列表
module.exports.queryAsync = function(sql, params) {
  return new Promise((resovle, reject) => {
    pool.getConnection((err, connection) => {
      if (err) throw err;
      // 执行SQL查询
      connection.query(sql, params, function (err, result, fields) {
        connection.release()
        if (err) {
          reject(err)
          return
        } else {
          resovle(result)
        }
      })
    });
  })
}

// 多表修改  开启事务 （sql之间没有依赖关系 独立查表  修改数据； 若有依赖关系  请根据不同业务场景  针对性编写事务代码）
module.exports.execTransection = (sqlArr) => {
  return new Promise((resolve, reject) => {
      var promiseArr = [];
      pool.getConnection(function (err, connection) {
          if (err) {
              return reject(err)
          }
          connection.beginTransaction(err => {
              if (err) {
                  return reject('开启事务失败')
              }
              // 将所有需要执行的sql封装为数组
              promiseArr = sqlArr.map(({ sql, values }) => {
                  return new Promise((resolve, reject) => {
                      connection.query(sql, values, (e, rows, fields) => {
                          e ? reject(e) : resolve({ rows, success: true })
                      })
                  })
              })
              // Promise调用所有sql，一旦出错，回滚，否则，提交事务并释放链接
              Promise.all(promiseArr).then(res => {
                connection.commit((error) => {
                    if (error) {
                        console.log('事务提交失败')
                        reject(error)
                    }
                })
                connection.release()  // 释放链接
                resolve(res)
              }).catch(err => {
                  connection.rollback(() => {
                      console.log('数据操作回滚')
                  })
                  reject(err)
              })
          })
      });
  })
}


