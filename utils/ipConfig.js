const os = require('os')

const getIPAdress = () => {
    let interfaces = os.networkInterfaces()
    // console.log(interfaces, 'interfaces');
    for (let devName in interfaces) {
        let iface = interfaces[devName]
        // console.log(iface, devName);
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i]
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                console.log(alias.address);
                return alias.address
            }
        }
    }
}

module.exports = { getIPAdress }