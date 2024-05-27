module.exports = app => {
    
    // system
    require('./system/user')(app)
    require('./system/menu')(app)
    require('./system/login')(app)
    require('./system/dictionary')(app)
    require('./system/role')(app)
    require('./system/department')(app)
    require('./system/upload')(app)
    // monitor
    require('./monitor/BMSData')(app)
    require('./monitor/UPSData')(app)
    require('./monitor/PCSData')(app)
    require('./monitor/EMSData')(app)
    require('./monitor/electricMeterData')(app)
    require('./monitor/dehumidifierData')(app)
    require('./monitor/fireFightData')(app)
    require('./monitor/temperatureData')(app)
    //dashboard
    require('./dashboard/index')(app)
    //history
    require('./history/index')(app)
    //controlStrategy
    require('./controlStrategy/index')(app)

    // 错误处理
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message,
            code: err.statusCode || 500
        })
    })

}
