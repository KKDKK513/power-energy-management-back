const initializeSerialPort = require('../../model/system/serialportHandler');
const port485_UART4 = initializeSerialPort('/dev/ttyS6', 9600);
const CRC = require('../../plugins/config/CRC');
function swapBytes(crc) {
    return crc.substr(2) + crc.substr(0, 2);
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    return swapBytes(crc.toString(16).toUpperCase().padStart(4, '0')).toLowerCase();
}
const messages485_UART4 = [
    [0x01, 0x03, 0x6020, 0x0001],
    [0x01, 0x03, 0x6021, 0x0001],
    [0x01, 0x03, 0x6022, 0x0001],
    [0x01, 0x03, 0x6023, 0x0001],
    [0x01, 0x03, 0x6024, 0x0001],
    [0x01, 0x03, 0x6025, 0x0001],
    [0x01, 0x03, 0x6026, 0x0001],
    [0x01, 0x03, 0x6027, 0x0001],
    [0x01, 0x03, 0x6028, 0x0001],
    [0x01, 0x03, 0x6029, 0x0001],
    [0x01, 0x03, 0x602A, 0x0001],
    [0x01, 0x03, 0x602B, 0x0001],
    [0x01, 0x03, 0x602C, 0x0001],
    [0x01, 0x03, 0x602D, 0x0001],
    [0x01, 0x03, 0x6030, 0x0001],
    [0x01, 0x03, 0x6031, 0x0001],
    [0x01, 0x03, 0x6032, 0x0001],
    [0x01, 0x03, 0x6033, 0x0001],
    [0x01, 0x03, 0x6034, 0x0001],
    [0x01, 0x03, 0x6035, 0x0001],
    [0x01, 0x03, 0x6036, 0x0001],
    [0x01, 0x03, 0x6037, 0x0001],
    [0x01, 0x03, 0x6038, 0x0001],
    [0x01, 0x03, 0x6039, 0x0001],
    [0x01, 0x03, 0x603A, 0x0001],
    [0x01, 0x03, 0x603B, 0x0001],
    [0x01, 0x03, 0x603C, 0x0001],
    [0x01, 0x03, 0x6050, 0x0001],
    [0x01, 0x03, 0x6051, 0x0001],
    [0x01, 0x03, 0x6052, 0x0001],
    [0x01, 0x03, 0x6053, 0x0001],
    [0x01, 0x03, 0x6054, 0x0001],
    [0x01, 0x03, 0x6055, 0x0001],
    [0x01, 0x03, 0x6056, 0x0001],
    [0x01, 0x03, 0x6057, 0x0001],
    [0x01, 0x03, 0x6058, 0x0001],
    [0x01, 0x03, 0x6059, 0x0001],
    [0x01, 0x03, 0x605A, 0x0001],
    [0x01, 0x03, 0x605B, 0x0001],
    [0x01, 0x03, 0x6000, 0x0001],
    [0x01, 0x03, 0x6001, 0x0001],
    [0x01, 0x03, 0x6002, 0x0001],
    [0x01, 0x03, 0x6003, 0x0001],
    [0x01, 0x03, 0x6004, 0x0001],
    [0x01, 0x03, 0x6005, 0x0001],
    [0x01, 0x03, 0x0189, 0x0001],
    [0x01, 0x03, 0x018A, 0x0001],
    [0x01, 0x03, 0x018B, 0x0001],
    [0x01, 0x03, 0x6010, 0x0001],
    [0x01, 0x03, 0x6011, 0x0001],
    [0x01, 0x03, 0x6012, 0x0001],
    [0x01, 0x03, 0x6013, 0x0001],
    [0x01, 0x03, 0x6014, 0x0001],
    [0x01, 0x03, 0x6015, 0x0001],
    [0x01, 0x03, 0x6016, 0x0001],
    [0x01, 0x03, 0x6017, 0x0001],
    [0x01, 0x03, 0x6018, 0x0001],
    [0x01, 0x03, 0x6019, 0x0001],
    [0x01, 0x03, 0x601A, 0x0001],
    [0x01, 0x03, 0x601B, 0x0001],
    [0x01, 0x03, 0x601C, 0x0001],
    [0x01, 0x03, 0x601D, 0x0001],
    [0x01, 0x03, 0x601E, 0x0001],
    [0x01, 0x03, 0x601F, 0x0001],
    [0x01, 0x03, 0x0D57, 0x0001],
    [0x01, 0x03, 0x0D58, 0x0001],
    [0x01, 0x03, 0x5066, 0x0001],
    [0x01, 0x03, 0x501B, 0x0001],
    [0x01, 0x03, 0x02A6, 0x0001],
    [0x01, 0x03, 0x02A7, 0x0001],
    [0x01, 0x03, 0x02A8, 0x0001],
    [0x01, 0x03, 0x02A9, 0x0001],
    [0x01, 0x03, 0x02AA, 0x0001],
    [0x01, 0x03, 0x02AB, 0x0001],
    [0x01, 0x03, 0x1633, 0x0001],
    [0x01, 0x03, 0x1634, 0x0001],
    [0x01, 0x03, 0x1640, 0x0001],
    [0x01, 0x03, 0x1611, 0x0001],
    [0x01, 0x03, 0x1612, 0x0001],
    [0x01, 0x03, 0x1641, 0x0001],
    [0x01, 0x03, 0x1600, 0x0001],
    [0x01, 0x03, 0x1601, 0x0001],
    [0x01, 0x03, 0x1603, 0x0001],
    [0x01, 0x03, 0x1620, 0x0001],
    [0x01, 0x03, 0x1643, 0x0001],
    [0x01, 0x03, 0x1644, 0x0001],
    [0x01, 0x03, 0x1650, 0x0001],
    [0x01, 0x03, 0x1651, 0x0001],
    [0x01, 0x03, 0x1653, 0x0001],
    [0x01, 0x03, 0x1654, 0x0001],
    [0x01, 0x03, 0x0291, 0x0001],
    [0x01, 0x03, 0x1400, 0x0001],
    [0x01, 0x03, 0x1405, 0x0001],
    [0x01, 0x03, 0x1010, 0x0001],
    [0x01, 0x03, 0x1007, 0x0001],
    [0x01, 0x03, 0x1011, 0x0001],
    [0x01, 0x03, 0x1004, 0x0001],
    [0x01, 0x03, 0x1648, 0x0001],
    [0x01, 0x03, 0x1700, 0x0001],
    [0x01, 0x03, 0x1701, 0x0001],
    [0x01, 0x03, 0x1702, 0x0001],
    [0x01, 0x03, 0x1703, 0x0001],
    [0x01, 0x03, 0x1704, 0x0001],
    [0x01, 0x03, 0x1705, 0x0001],
    [0x01, 0x03, 0x1706, 0x0001],
    [0x01, 0x03, 0x1707, 0x0001]
];
function sendMessage(data) {
    return new Promise((resolve, reject) => {
        const address = data[0];
        const funcCode = data[1];
        const startAddress = data[2];
        let _data;
        if (data[3] < 0) { // 取补码
            _data = 65536 + data[3]; 
        } else {
            _data = data[3];
        }
        const res = CRC(address, funcCode, startAddress, _data);
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
let isRead = 0
async function handleAndReadMessages(data = messages485_UART4) {
    if (isRead == 1) {
        while(isRead == 1) {
            console.log(isRead, 'pcsisReadhandleAndReadMessages2');
            await delay(500)
        }
    }
    isRead = 1
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
                isRead = 0
                return currentData
            }
        }
    } catch (error) {
        console.error('处理并读取消息时发生错误:', error.message);
        process.exit(1);
    }
}

function prepareData(data3, data4) {
    let data1 = 0x01;
    let data2 = 0x06;
    let dataArray = [data1, data2, data3, data4];
    return dataArray;
}
async function sendMessage1(data) { // 增加超时 默认5秒 超时的时间可以单独设置
    return new Promise((resolve, reject) => {
        const address = data[0];
        const funcCode = data[1];
        const startAddress = data[2];
        let _data;
        if (data[3] < 0) { // 取补码
            _data = 65536 + data[3]; 
        } else {
            _data = data[3];
        }
        const res = CRC(address, funcCode, startAddress, _data);
        port485_UART4.write(res);
        port485_UART4.read(function (response) {
            resolve({ request: res, response: response }); // 将res存储在request属性中
        }, 'byteLength8'); // 5.6使用解析器进行解析
    });
}
async function processData(command) {
    if (isRead == 1) {
        while(isRead == 1) {
            console.log(isRead, 'pcsisReadprocessData2');
            await delay(500)
        }
    }
    isRead = 1
    const address = command.address;
    const data = command.data;
    const hexData = data.toString(16).padStart(2, '0');
    const toSend = prepareData(address, parseInt(hexData, 16));
    console.log('toSend', toSend);
    try {
        const { request, response } = await sendMessage1(toSend);
        console.log('request', request); // 发送数据需要打印一下
        const rs = request.slice(0, 6);
        const crc = response.slice(0, 6);
        const crc_rs = crc16(crc);
        const hexResponse = response.toString('hex');
        const crcResult = hexResponse.slice(-4);
        if (crcResult === crc_rs && Buffer.compare(crc, rs) === 0) {
            console.log('数据修改成功!');
            isRead = 0
        } else {
            console.log('数据修改失败: CRC校验错误/发送和接收的数据不符');
            process.exit(1);
        }
    } catch (error) {
        console.error('处理数据时出现错误:', error);
        process.exit(1);
    }
}
module.exports = { handleAndReadMessages, processData };
