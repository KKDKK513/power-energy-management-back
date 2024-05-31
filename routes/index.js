module.exports = app => {
    
    require('./system/user')(app)
    require('./system/menu')(app)
    require('./system/login')(app)
    require('./system/dictionary')(app)
    require('./system/role')(app)
    require('./system/department')(app)
    require('./system/upload')(app)
    require('./monitor/BMSData')(app)
    require('./monitor/UPSData')(app)
    require('./monitor/PCSData')(app)
    require('./monitor/EMSData')(app)
    require('./monitor/electricMeterData')(app)
    require('./monitor/dehumidifierData')(app)
    require('./monitor/fireFightData')(app)
    require('./monitor/temperatureData')(app)
    require('./dashboard/index')(app)
    require('./history/index')(app)
    require('./controlStrategy/index')(app)

    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message,
            code: err.statusCode || 500
        })
    })

}
