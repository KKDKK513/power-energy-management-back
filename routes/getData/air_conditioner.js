const initializeSerialPort = require('../../model/system/serialportHandler');
const port485_UART4 = initializeSerialPort('/dev/ttyS4', 9600);
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
    [0x01, 0x03, 0x0433, 0x0001],
    [0x01, 0x03, 0x0434, 0x0001],
    [0x01, 0x03, 0x0435, 0x0001],
    [0x01, 0x03, 0x0436, 0x0001],
    [0x01, 0x03, 0x0437, 0x0001],
    [0x01, 0x03, 0x0438, 0x0001],
    [0x01, 0x03, 0x0439, 0x0001],
    [0x01, 0x03, 0x0100, 0x0001],
    [0x01, 0x03, 0x0101, 0x0001],
    [0x01, 0x03, 0x0102, 0x0001],
    [0x01, 0x03, 0x0103, 0x0001],
    [0x01, 0x03, 0x0104, 0x0001],
    [0x01, 0x03, 0x0500, 0x0001],
    [0x01, 0x03, 0x0501, 0x0001],
    [0x01, 0x03, 0x0502, 0x0001],
    [0x01, 0x03, 0x0503, 0x0001],
    [0x01, 0x03, 0x0504, 0x0001],
    [0x01, 0x03, 0x0600, 0x0001],
    [0x01, 0x03, 0x0601, 0x0001],
    [0x01, 0x03, 0x0602, 0x0001],
    [0x01, 0x03, 0x0606, 0x0001],
    [0x01, 0x03, 0x0608, 0x0001],
    [0x01, 0x03, 0x0609, 0x0001],
    [0x01, 0x03, 0x060C, 0x0001],
    [0x01, 0x03, 0x060E, 0x0001],
    [0x01, 0x03, 0x611, 0x0001],
    [0x01, 0x03, 0x612, 0x0001],
    [0x01, 0x03, 0x61E, 0x0001],
    [0x01, 0x03, 0x0300, 0x0001],
    [0x01, 0x03, 0x0301, 0x0001],
    [0x01, 0x03, 0x0303, 0x0001],
    [0x01, 0x03, 0x0304, 0x0001],
    [0x01, 0x03, 0x0307, 0x0001],
    [0x01, 0x03, 0x0308, 0x0001],
    [0x01, 0x03, 0x0309, 0x0001],
    [0x01, 0x03, 0x030B, 0x0001]
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
                return; // 递归调用后立即返回，避免重复输出“所有PCS的数据”信息
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
