const express = require('express')

const app = express()
app.all("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Credentials", "true")
    next()
});
app.use('/', express.static('public'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(express.json())
app.set('SECRET', 'POWER_ENERGY_MANAGE_PLATFORM_2024')

require('./routes')(app)

const { getIPAdress } = require('./utils/ipConfig')

let host = getIPAdress()
const port = 8125
console.log(host, 'host');
app.listen(port, () => {
    console.log(`http://${host}:${port} has been already started ...`);
})

