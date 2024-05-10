const initializeSerialPort = require('../../model/system/serialportHandler');
const port232 = initializeSerialPort('/dev/ttyS3', 2400);
const message232 = [
    [0x7e, 0x30, 0x30, 0x50, 0x30, 0x30, 0x33, 0x53, 0x54, 0x42],
    [0x7e, 0x30, 0x30, 0x50, 0x30, 0x30, 0x33, 0x53, 0x54, 0x49],
    [0x7e, 0x30, 0x30, 0x50, 0x30, 0x30, 0x33, 0x53, 0x54, 0x4f],
    [0x7e, 0x30, 0x30, 0x50, 0x30, 0x30, 0x33, 0x53, 0x54, 0x41]
];
const message232Format = message232.map(arr => Buffer.from(arr));
function bufferToAscii(buffer) {
    let asciiStr = '';
    for (let byte of buffer) {
        asciiStr += String.fromCharCode(byte);
    }
    return asciiStr;
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
function sendMessage(data) {
    return new Promise((resolve, reject) => {
        port232.write(data);
        port232.read(function (response) {
            resolve(response);
        }, 'delimiter');
    });
}
async function handleAndReadMessages(data = message232Format) {
    let currentData = [];
    try {
        for (let i = 0; i < data.length; i++) {
            const message = data[i];
            const response = await sendMessage(message);
            const hexData = bufferToAscii(response);
            currentData.push(hexData);
            if (i === data.length - 1) {
                console.log('UPS所有数据—>', currentData, getCurrentDateTimeFormatted());
                return currentData
            }
        }
    } catch (error) {
        console.error('处理和读取消息时出现错误：', error);
        process.exit(1);
    }
}
module.exports = { handleAndReadMessages };