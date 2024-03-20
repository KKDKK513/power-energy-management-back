module.exports = app => {
    
    // system
    require('./system/user')(app)
    require('./system/menu')(app)
    require('./system/login')(app)
    require('./system/dictionary')(app)
    require('./system/role')(app)
    require('./system/department')(app)
    require('./system/article')(app)
    require('./system/comment')(app)
    require('./system/record')(app)
    require('./system/upload')(app)
    require('./system/process')(app)

    // 错误处理
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message,
            code: err.statusCode || 500
        })
    })

}
