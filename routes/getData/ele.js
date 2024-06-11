const initializeSerialPort = require('../../model/system/serialportHandler');
const port485_UART4 = initializeSerialPort('/dev/ttyS5', 9600);
const CRC = require('../../plugins/config/CRC');
function swapBytes(crc) {
    return crc.substr(2) + crc.substr(0, 2);
}
function crc16(buffer) {
    let crc = 0xFFFF;
    for (let i = 0; i < buffer.length; i++) {
        crc = (crc ^ buffer[i]) & 0xFFFF;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x0001) {
                crc = (crc >> 1) ^ 0xA001;
            } else {
                crc = crc >> 1;
            }
        }
    }
    return swapBytes(crc.toString(16).toUpperCase().padStart(4, '0')).toLowerCase(); // 转换为小写字母
}
const messages485_UART4 = [
    [0x01, 0x03, 0x0061, 0x0001],
    [0x01, 0x03, 0x0062, 0x0001],
    [0x01, 0x03, 0x0063, 0x0001],
    [0x01, 0x03, 0x0064, 0x0001],
    [0x01, 0x03, 0x0065, 0x0001],
    [0x01, 0x03, 0x0066, 0x0001],
    [0x01, 0x03, 0x0067, 0x0001],
    [0x01, 0x03, 0x0068, 0x0001],
    [0x01, 0x03, 0x0069, 0x0001],
    [0x01, 0x03, 0x006A, 0x0001],
    [0x01, 0x03, 0x006B, 0x0001],
    [0x01, 0x03, 0x006C, 0x0001],
    [0x01, 0x03, 0x006D, 0x0001],
    [0x01, 0x03, 0x006E, 0x0001],
    [0x01, 0x03, 0x006F, 0x0001],
    [0x01, 0x03, 0x0070, 0x0001],
    [0x01, 0x03, 0x0071, 0x0001],
    [0x01, 0x03, 0x0072, 0x0001],
    [0x01, 0x03, 0x0073, 0x0001],
    [0x01, 0x03, 0x0074, 0x0001],
    [0x01, 0x03, 0x0075, 0x0001],
    [0x01, 0x03, 0x0076, 0x0001],
    [0x01, 0x03, 0x0077, 0x0001],
    [0x01, 0x03, 0x0078, 0x0001],
    [0x01, 0x03, 0x0079, 0x0001],
    [0x01, 0x03, 0x007A, 0x0001],
    [0x01, 0x03, 0x0092, 0x0001],
    [0x01, 0x03, 0x0093, 0x0001],
    [0x01, 0x03, 0x0094, 0x0001],
    [0x01, 0x03, 0x00A4, 0x0001],
    [0x01, 0x03, 0x00A5, 0x0001],
    [0x01, 0x03, 0x008D, 0x0001],
    [0x01, 0x03, 0x008E, 0x0001],
    [0x01, 0x03, 0x0091, 0x0001],
    [0x01, 0x03, 0x0125, 0x0001],
    [0x01, 0x03, 0x0126, 0x0001],
    [0x01, 0x03, 0x0127, 0x0001],
    [0x01, 0x03, 0x0128, 0x0001],
    [0x01, 0x03, 0x0129, 0x0001],
    [0x01, 0x03, 0x012A, 0x0001],
    [0x01, 0x03, 0x012B, 0x0001],
    [0x01, 0x03, 0x012C, 0x0001],
    [0x01, 0x03, 0x012D, 0x0001],
    [0x01, 0x03, 0x012E, 0x0001],
    [0x01, 0x03, 0x012F, 0x0001],
    [0x01, 0x03, 0x0130, 0x0001],
    [0x01, 0x03, 0x0131, 0x0001],
    [0x01, 0x03, 0x0132, 0x0001],
    [0x01, 0x03, 0x0133, 0x0001],
    [0x01, 0x03, 0x0134, 0x0001],
    [0x01, 0x03, 0x0135, 0x0001],
    [0x01, 0x03, 0x0136, 0x0001],
    [0x01, 0x03, 0x0137, 0x0001],
    [0x01, 0x03, 0x0138, 0x0001],
    [0x01, 0x03, 0x0139, 0x0001]
];
function sendMessage(data) {
    return new Promise((resolve, reject) => {
        const address = data[0];
        const funcCode = data[1];
        const startAddress = data[2];
        const quantity = data[3];
        const res = CRC(address, funcCode, startAddress, quantity);
        port485_UART4.port.close(function (err) { // 测试内容
            if (err) {
            } else {
                port485_UART4.port.open(function (err) {
                    if (err) {
                    } else {
                        port485_UART4.write(res);
                    }
                });
            }
        });
        port485_UART4.read(function (response) {
            resolve(response);
        });
    });
}
function getCurrentDateTimeFormatted() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let day = ("0" + currentDate.getDate()).slice(-2);
    let hours = ("0" + currentDate.getHours()).slice(-2);
    let minutes = ("0" + currentDate.getMinutes()).slice(-2);
    let seconds = ("0" + currentDate.getSeconds()).slice(-2);
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}
async function handleAndReadMessages(data = messages485_UART4) {
    let currentData = [];
    try {
        for (let i = 0; i < data.length; i++) {
            const message = data[i];
            const response = await sendMessage(message);
            const crc = response.slice(0, 5);
            const crc_rs = crc16(crc);
            const hexData = response.toString('hex');
            const crcResult = hexData.slice(-4);
            if (crcResult === crc_rs) {
                currentData.push(hexData);
            } else {
                console.log('获取数据错误:CRC校验错误');
                await handleAndReadMessages(data = messages485_UART4);
                return; 
            }
            if (i === data.length - 1) {
                return currentData
            }
        }
    } catch (error) {
        console.error('处理并读取消息时发生错误:', error.message);
        process.exit(1);
    }
}
module.exports = { handleAndReadMessages };