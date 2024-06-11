const canConfig = require('../../plugins/config/canconfig');
canConfig.configureCan0Interface();
canConfig.configureCan1Interface();
const handleCanMessages = require('../../model/system/canHandler');
function handleAndReadCanMessages(channelName, canId) {
    return new Promise((resolve, reject) => {
        const handler = handleCanMessages(channelName, canId);
        handler.send();
        handler.read(function (data) {
            resolve(data);
        });
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function decimalToHex(decimal) {
    return decimal.toString(16);
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
async function readAllCanMessagesAtInterval(canIds) {
    let currentData = [];
    let processedCanIds = 0;
    for (const canId of canIds) {
        const msg = await handleAndReadCanMessages("can0", canId);
        const hexData = msg.data.toString('hex');
        const parts = hexData.match(/.{2}/g);
        const canIdhyc = decimalToHex(msg.id).substring(0, 5);
        const canId123 = decimalToHex(canId).substring(0, 5);
        if (canIdhyc === canId123) {
            currentData.push(parts.join(''));
            processedCanIds++;
            if (processedCanIds === canIds.length) {
                return currentData
            }
        }
    }
}



function handleAndReadCanMessagesNew(channelName, canId, canData) { // 写
    return new Promise(async (resolve, reject) => {
        const handler = handleCanMessages(channelName, canId);
        handler.send1(canData);
        handler.read(function (data) {
            resolve(data);
        });
    });
}
async function readAllCanMessagesAtIntervalNew(canSend) {
    let currentData = [];
    let processedCanIds = 0;
    for (const canId of canSend.canIds) {
        const msg = await handleAndReadCanMessagesNew("can0", canSend.canIds, canSend.canData);
        console.log('hyc123', msg);
        const hexData = msg.data.toString('hex');
        const parts = hexData.match(/.{2}/g);
        const canIdhyc = decimalToHex(msg.id).substring(0, 5);
        const canId123 = decimalToHex(canId).substring(0, 5);
        if (canIdhyc === canId123) {
            currentData.push(parts.join(''));
            processedCanIds++;
            if (processedCanIds === canSend.canIds.length) {
                console.log("修改过后的数据: ", currentData); // 看看是否要与修改之前的数据进行比较
            }
        }
    }
}
async function processAllCanSendsAtInterval(canSends) {
    for (const canSend of canSends) {
        console.log('cnm', canSend);
        readAllCanMessagesAtIntervalNew(canSend);
    }
}
module.exports = { readAllCanMessagesAtInterval, processAllCanSendsAtInterval };