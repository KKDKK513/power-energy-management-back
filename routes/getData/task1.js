const canConfig = require('../../plugins/config/canconfig');
const fs = require('fs');
const path = require('path');
canConfig.configureCan0Interface();
canConfig.configureCan1Interface();
const handleCanMessages = require('../../model/system/canHandler');
const { handleAndReadMessages: handleAndReadAirMessages } = require('./air_conditioner')
const { handleAndReadMessages: handleAndReadPCSMessages, processData } = require('./pcs')
const { readAllCanMessagesAtInterval: readAllCanMessagesAtIntervalBcu } = require('../../routes/getData/bcu')
const canIdshyc = [0x1C8E7010];
const canIds1 = [0x1C8E8010];
const canData = [0x00, 0x01];
const canData0 = [0x00, 0x00];
const commandB = {
    address: '0x5066',
    data: 0
};
const command_PowerOn = {
    address: '0x0291',
    data: 1
};
const command_charging = {
    address: '0x0D57',
    data: -760
};
const command_discharge = {
    address: '0x0D57',
    data: 400
};
const command_PowerDown = {
    address: '0x0291',
    data: 0
};
const pcsAlarmList = [
    [0x01, 0x03, 0x1700, 0x0001],
    [0x01, 0x03, 0x1701, 0x0001],
    [0x01, 0x03, 0x1702, 0x0001],
    [0x01, 0x03, 0x1703, 0x0001],
    [0x01, 0x03, 0x1704, 0x0001],
    [0x01, 0x03, 0x1705, 0x0001],
    [0x01, 0x03, 0x1706, 0x0001],
    [0x01, 0x03, 0x1707, 0x0001]
]
const airAlarmList = [
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
    [0x01, 0x03, 0x61E, 0x0001]
]
const bcuAlarmList = [
    0x1C000010, 0x1C001010, 0x1C002010, 0x1C003010
]
function handleAndReadCanMessages(channelName, canId) {
    return new Promise((resolve, reject) => {
        const handler = handleCanMessages(channelName, canId);
        handler.send();
        handler.read(function (data) {
            resolve(data);
        });
    });
}
function decimalToHex(decimal) {
    return decimal.toString(16);
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getCurrentDateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
}
const canIds = [
    0x1C000010, 0x1C001010, 0x1C002010, 0x1C003010,
    0x1C405010, 0x1C406010, 0x1C40D010, 0x1C415010, 0x1C401010, 0x1C400010,
    0x1C300010, 0x1C301010, 0x1C302010, 0x1C303010, 0x1C304010, 0x1C305010, 0x1C306010, 0x1C307010, 0x1C308010, 0x1C309010, 0x1C30A010, 0x1C30B010, 0x1C30C010, 0x1C30D010, 0x1C30E010, 0x1C30F010, 0x1C310010, 0x1C311010, 0x1C312010, 0x1C313010, 0x1C314010, 0x1C315010, 0x1C316010, 0x1C317010, 0x1C318010, 0x1C319010, 0x1C31A010, 0x1C31B010, 0x1C31C010, 0x1C31D010, 0x1C31E010, 0x1C31F010, 0x1C320010, 0x1C321010, 0x1C322010, 0x1C323010, 0x1C324010, 0x1C325010, 0x1C326010, 0x1C327010, 0x1C328010, 0x1C329010, 0x1C32A010, 0x1C32B010, 0x1C32C010, 0x1C32D010, 0x1C32E010, 0x1C32F010, 0x1C330010, 0x1C331010, 0x1C332010, 0x1C333010, 0x1C334010, 0x1C335010, 0x1C336010, 0x1C337010, 0x1C338010, 0x1C339010, 0x1C33A010, 0x1C33B010,
    0x1C402010, 0x1C403010, 0x1C404010, 0x1C407010, 0x1C408010, 0x1C409010, 0x1C40A010, 0x1C40B010,
    0x1C40E010, 0x1C40F010, 0x1C412010, 0x1C413010, 0x1C414010, 0x1C417010, 0x1C418010, 0x1C419010,
    0x1C100010, 0x1C101010, 0x1C102010, 0x1C103010, 0x1C104010, 0x1C105010, 0x1C106010, 0x1C107010, 0x1C108010, 0x1C109010, 0x1C10A010, 0x1C10B010, 0x1C10C010, 0x1C10D010, 0x1C10E010, 0x1C10F010, 0x1C110010, 0x1C111010, 0x1C112010, 0x1C113010, 0x1C114010, 0x1C115010,
    0x1C116010, 0x1C117010, 0x1C118010, 0x1C119010, 0x1C11A010, 0x1C11B010, 0x1C11C010, 0x1C11D010, 0x1C11E010, 0x1C11F010, 0x1C120010, 0x1C121010, 0x1C122010, 0x1C123010, 0x1C124010, 0x1C125010, 0x1C126010, 0x1C127010, 0x1C128010, 0x1C129010, 0x1C12A010, 0x1C12B010,
    0x1C12C010, 0x1C12D010, 0x1C12E010, 0x1C12F010, 0x1C130010, 0x1C131010, 0x1C132010, 0x1C133010, 0x1C134010, 0x1C135010, 0x1C136010, 0x1C137010, 0x1C138010, 0x1C139010, 0x1C13A010, 0x1C13B010, 0x1C200010, 0x1C201010, 0x1C202010, 0x1C203010, 0x1C204010, 0x1C205010,
    0x1C206010, 0x1C207010, 0x1C208010, 0x1C209010, 0x1C20A010, 0x1C20B010, 0x1C20C010, 0x1C20D010, 0x1C20E010, 0x1C20F010, 0x1C210010, 0x1C211010, 0x1C212010, 0x1C213010, 0x1C214010, 0x1C215010,
    0x1C216010, 0x1C217010, 0x1C218010, 0x1C219010, 0x1C21A010, 0x1C21B010, 0x1C21C010, 0x1C21D010, 0x1C21E010, 0x1C21F010, 0x1C220010, 0x1C221010, 0x1C222010, 0x1C223010, 0x1C224010, 0x1C225010, 0x1C226010, 0x1C227010, 0x1C228010, 0x1C229010, 0x1C22A010, 0x1C22B010,
    0x1C22C010, 0x1C22D010, 0x1C22E010, 0x1C22F010, 0x1C230010, 0x1C231010, 0x1C232010, 0x1C233010, 0x1C234010, 0x1C235010, 0x1C236010, 0x1C237010, 0x1C238010, 0x1C239010, 0x1C23A010, 0x1C23B010,
    0x1C800010, 0x1C804010, 0x1C808010, 0x1C809010, 0x1C82D010, 0x1C830010, 0x1C837010, 0x1C838010, 0x1C839010
];
function checkAlarmStatus1(alarmList) {
    let alarmStatus = false;
    for (let alarm of alarmList) {
        if (alarm !== '0103020000b844') {
            alarmStatus = true;
            break;
        }
    }
    return alarmStatus;
}
function checkAlarmStatusBcu(alarmList) {
    let alarmStatus = false;
    for (let alarm of alarmList) {
        if (alarm !== '0000000000000000') {
            alarmStatus = true;
            break;
        }
    }
    return alarmStatus;
}

function promiseWithTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error('Promise timed out after ' + ms + ' ms'));
        }, ms);
    });

    return Promise.race([
        promise,
        timeout
    ]);
}

async function readAllCanMessagesAtInterval(canIds) {
    let currentData = [];
    let currentData405 = [];
    let currentData406 = [];
    let currentData40D = [];
    let currentData415 = [];
    let currentData401 = [];
    let currentData400 = [];
    let currentData0x1C000010 = [];
    let currentData0x1C001010 = [];
    let currentData0x1C002010 = [];
    let currentData0x1C003010 = [];
    let results = {};
    for (const canId of canIds) {
        const msg = await handleAndReadCanMessages("can0", canId);
        const hexData = msg.data.toString('hex');
        const parts = hexData.match(/.{2}/g);
        const canIdhyc = decimalToHex(msg.id).substring(0, 5);
        const canId123 = decimalToHex(canId).substring(0, 5);
        if (canIdhyc === canId123) {
            if (canId === 0x1C405010) { // 最高单体电压 - 完成
                currentData405.push(parts.join(''));
                const str = currentData405[0];
                const result = str.substring(4, 8);
                results['0x1C405010'] = result;
            } else if (canId === 0x1C406010) { // 最低单体电压 - 完成
                currentData406.push(parts.join(''));
                const str = currentData406[0];
                const result = str.substring(12, 16);
                results['0x1C406010'] = result;
            } else if (canId === 0x1C40D010) { // soc soh - 完成
                currentData40D.push(parts.join(''));
                const str = currentData40D[0];
                const result1 = str.substring(0, 4);
                const result2 = str.substring(5, 8);
                const decimalResultsoc = Math.round(parseInt(result1, 16) * 0.1);
                const decimalResultsoh = Math.round(parseInt(result2, 16) * 0.1);
                let hexResultsoc = '0x' + decimalResultsoc.toString(16).padStart(2, '0');
                let hexResultsoh = '0x' + decimalResultsoh.toString(16).padStart(2, '0');
                results['0x1C40D010'] = { soc: hexResultsoc, soh: hexResultsoh };
            } else if (canId === 0x1C415010) { // 总正继电器状态 - 完成
                currentData415.push(parts.join(''));
                const str = currentData415[0];
                const result = str.substring(0, 4);
                const decimalResult415 = parseInt(result, 16);
                const res = decimalResult415.toString(2);
                const resSecondLastBit = res[res.length - 2];
                const formattedResult = resSecondLastBit === '1' ? '0x01' : '0x00';
                results['0x1C415010'] = formattedResult;
            } else if (canId === 0x1C401010) { // B+总压 总电压 - 完成
                currentData401.push(parts.join(''));
                const str = currentData401[0];
                const result = str.substring(0, 4)
                results['0x1C401010'] = result;
            } else if (canId === 0x1C400010) { // 总充放电电流 + 系统充放电状态 - 完成
                currentData400.push(parts.join(''));
                const str = currentData400[0];
                const result0 = str.substring(2, 4);
                const result = str.substring(4, 8);
                results['0x1C400010'] = result;
                results['0x1C400010111'] = result0;
            } else if (canId === 0x1C000010) {
                currentData0x1C000010.push(parts.join(''));
            } else if (canId === 0x1C001010) {
                currentData0x1C001010.push(parts.join(''));
            } else if (canId === 0x1C002010) {
                currentData0x1C002010.push(parts.join(''));
            } else if (canId === 0x1C003010) {
                currentData0x1C003010.push(parts.join(''));
            } else {
                currentData.push(parts.join(''));
                currentData = [...currentData405, ...currentData406, ...currentData40D, ...currentData415, ...currentData401, ...currentData400, ...currentData0x1C000010, ...currentData0x1C001010, ...currentData0x1C002010, ...currentData0x1C003010, ...currentData];
                return {
                    results: results,
                    currentData: currentData
                };
            }
        } else {
            console.log('接收和发送的canId不一致');
        }
    }
}
let highestCellVoltage, lowestCellVoltage, soc, soh, mainPositiveRelay, totalVoltage, chargeDischargeCurrent, batteryStatus;

let _pcsAlarm, _airAlarm, _bcuAlarm, pcsStatus, airStatus, bcuStatus, currentDateTime, hycc;
let allStatus = true;

async function fetchData() {
    const { results, currentData } = await readAllCanMessagesAtInterval(canIds);
    highestCellVoltage = results['0x1C405010']; // 最高单体电压
    lowestCellVoltage = results['0x1C406010']; // 最低单体电压
    soc = results['0x1C40D010'].soc; // soc
    soh = results['0x1C40D010'].soh; // soh
    mainPositiveRelay = results['0x1C415010']; // 总正继电器状态
    totalVoltage = results['0x1C401010']; // B+总压 总电压
    chargeDischargeCurrent = results['0x1C400010']; // 总充放电电流
    batteryStatus = results['0x1C400010111']; // 充放电状态
}

async function updateStatus() {
    _pcsAlarm = await handleAndReadPCSMessages(pcsAlarmList);
    _airAlarm = await handleAndReadAirMessages(airAlarmList);
    _bcuAlarm = await readAllCanMessagesAtIntervalBcu(bcuAlarmList);
    pcsStatus = checkAlarmStatus1(_pcsAlarm);
    airStatus = checkAlarmStatus1(_airAlarm);
    bcuStatus = checkAlarmStatusBcu(_bcuAlarm);
    allStatus = !(airStatus || pcsStatus || bcuStatus);
}

async function readAllCan1MessagesAtInterval() {
    const maxRetries = 3;
    const timeoutDuration = 5000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let firstPart = '0x' + highestCellVoltage.substring(0, 2);
            let secondPart = '0x' + highestCellVoltage.substring(2);
            let thirdPart = '0x' + lowestCellVoltage.substring(0, 2);
            let fourPart = '0x' + lowestCellVoltage.substring(2);
            const canData = [firstPart, secondPart, thirdPart, fourPart, soc, soh, 0x00, mainPositiveRelay];

            await promiseWithTimeout(handleAndReadCanMessagesNew("can1", 0x180150F1, canData), timeoutDuration);
            console.log('CAN message handled successfully');
            break;
        } catch (error) {
            console.error(`Error in attempt ${attempt} of readAllCan1MessagesAtInterval:`, error);
            if (attempt === maxRetries) {
                console.error('Max retries reached. Exiting...');
            } else {
                console.log('Retrying...');
            }
        }
    }
}

async function readAllCan1MessagesAtInterval1() {
    const maxRetries = 3;
    const timeoutDuration = 5000; // 超时时间，单位为毫秒

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let firstPart1 = '0x' + totalVoltage.substring(0, 2);
            let secondPart2 = '0x' + totalVoltage.substring(2);
            let thirdPart3 = '0x' + chargeDischargeCurrent.substring(0, 2);
            let fourPart4 = '0x' + chargeDischargeCurrent.substring(2);
            const canData1 = [firstPart1, secondPart2, thirdPart3, fourPart4, 0x8F, 0xE4, 0x70, 0x1C];
            await promiseWithTimeout(handleAndReadCanMessagesNew("can1", 0x180250F1, canData1), timeoutDuration);
            console.log('CAN message 1 handled successfully');
            break; // 成功后跳出循环
        } catch (error) {
            console.error(`Error in attempt ${attempt} of readAllCan1MessagesAtInterval1:`, error);
            if (attempt === maxRetries) {
                console.error('Max retries reached for readAllCan1MessagesAtInterval1. Exiting...');
            } else {
                console.log('Retrying readAllCan1MessagesAtInterval1...');
            }
        }
    }
}

async function readAllCan1MessagesAtInterval2() {
    const maxRetries = 3;
    const timeoutDuration = 5000; // 超时时间，单位为毫秒

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let status; // batteryStatus 0：空闲  1：放电  2：充电 3: 禁充禁放
            if (batteryStatus === '0x01') {
                status = 0x05;
            } else if (batteryStatus === '0x02') {
                status = 0x04;
            } else if (batteryStatus === '0x00') {
                status = 0x00;
            } else if (batteryStatus === '0x03') {
                status = 0x01;
            }
            const canData3 = [status, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            await promiseWithTimeout(handleAndReadCanMessagesNew("can1", 0x180650F1, canData3), timeoutDuration);
            console.log('CAN message 2 handled successfully');
            break; // 成功后跳出循环
        } catch (error) {
            console.error(`Error in attempt ${attempt} of readAllCan1MessagesAtInterval2:`, error);
            if (attempt === maxRetries) {
                console.error('Max retries reached for readAllCan1MessagesAtInterval2. Exiting...');
            } else {
                console.log('Retrying readAllCan1MessagesAtInterval2...');
            }
        }
    }
}

async function readAllCan1MessagesAtInterval3() {
    const maxRetries = 3;
    const timeoutDuration = 5000; // 超时时间，单位为毫秒

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const canData4 = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
            await promiseWithTimeout(handleAndReadCanMessagesNew("can1", 0x180750F1, canData4), timeoutDuration);
            console.log('CAN message 3 handled successfully');
            break; // 成功后跳出循环
        } catch (error) {
            console.error(`Error in attempt ${attempt} of readAllCan1MessagesAtInterval3:`, error);
            if (attempt === maxRetries) {
                console.error('Max retries reached for readAllCan1MessagesAtInterval3. Exiting...');
            } else {
                console.log('Retrying readAllCan1MessagesAtInterval3...');
            }
        }
    }
}

async function readAllCan1Messages() {
    console.log('can通讯');
    readAllCan1MessagesAtInterval();
    readAllCan1MessagesAtInterval1();
    readAllCan1MessagesAtInterval2();
    readAllCan1MessagesAtInterval3();
}

async function startDataFetching() {
    try {
        await updateStatus();
        await delay(100);
        await fetchData();
        await delay(100);
        await readAllCan1Messages();
        await delay(100);

        hycc = setInterval(async () => {
            try {
                await updateStatus();
                await delay(100);
                await fetchData();
                await delay(100);
                await readAllCan1Messages();
                await delay(100);
            } catch (error) {
                console.error('Error in interval:', error);
            }
        }, 2000);
    } catch (error) {
        console.error('Error in startDataFetching:', error);
    }
}

function handleAndReadCanMessagesNew(channelName, canId, canData) {
    return new Promise(async (resolve, reject) => {
        const handler = handleCanMessages(channelName, canId);
        handler.send1(canData);
        resolve()
    });
}
function handleAndReadCanMessagesNew1(channelName, canId, canData) {
    return new Promise(async (resolve, reject) => {
        const handler = handleCanMessages(channelName, canId);
        handler.send1(canData);
        handler.read(function (data) {
            resolve(data);
        });
    });
}

async function readAllCanMessagesAtInterval1(canIds) {
    let currentData = [];
    let currentReadData = []
    let processedCanIds = 0;
    for (const canId of canIds) {
        const msg = await handleAndReadCanMessagesNew1("can0", canId, canData);
        await delay(11000);
        const hexData = msg.data.toString('hex');
        const parts = hexData.match(/.{2}/g);
        const canIdhyc = decimalToHex(msg.id).substring(0, 5);
        const canId123 = decimalToHex(canId).substring(0, 5);
        if (canId === 0x1C8E7010 || canId === 0x1C8E8010) {
            const canIdOutIn = [0x1C414010]
            const _readMsg = await handleAndReadCanMessages('can0', canIdOutIn)
            const readMsg = _readMsg.data.toString('hex').match(/.{2}/g);
            if (canIdhyc === canId123) {
                currentData.push(parts.join(''));
                currentReadData.push(readMsg.join(''))
                processedCanIds++;
                if (processedCanIds === canIds.length) {
                    console.log('读取并簇/退簇状态:', currentReadData);
                    const resultsBing = Buffer.from([0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).toString('hex')
                    const resultsTui = Buffer.from([0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00]).toString('hex')
                    if (canId === 0x1C8E7010) {
                        if (resultsBing === currentReadData[0]) {
                            console.log('并簇成功');
                            return
                        } else {
                            console.log('并簇失败 请重试');
                        }
                    } else if (canId === 0x1C8E8010) {
                        if (resultsTui === currentReadData[0]) {
                            console.log('退簇成功');
                            return
                        } else {
                            console.log('退簇失败 请重试');
                        }
                    } else {
                        console.log('并簇退簇异常');
                    }
                }
            } else {
                console.log('错误原因:发送和接收的CANId不同');
                process.exit(1);
            }
        }
    }
}

let shouldContinuePlan = 2
let targetTime = {}
function changePlan(num) {
    console.log('num', num);
    shouldContinuePlan = num
}
function startTimewatch() {
    const relativePath = '../../plugins/time.txt';
    const filePath = path.join(__dirname, relativePath);
    let _targetTime = fs.readFileSync(filePath);
    targetTime = JSON.parse(_targetTime)
    shouldContinuePlan = targetTime.shouldContinuePlan
    fs.watch(filePath, (eventType, filename) => {
        if (filename) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`读取文件时出错: ${err}`);
                    return;
                }
                targetTime = JSON.parse(data)
                shouldContinuePlan = targetTime.shouldContinuePlan
            });
        }
    });
}

function getShouldContinuePlan() {
    return { shouldContinuePlan, allStatus }
}
function withTimeout(promise, timeout, errorMsg) {
    console.log(new Date(), 'start');
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            console.log(new Date(), 'end');
            reject(new Error(errorMsg));
        }, timeout);

        promise
            .then(response => {
                clearTimeout(timer);
                resolve(response);
            })
            .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
    });
}
function isWriteStop() {
    const relativePath = '../../plugins/time.txt';
    const filePath = path.join(__dirname, relativePath);
    let _targetTime = fs.readFileSync(filePath);
    _targetTime = JSON.parse(_targetTime)
    let _data = {
        ..._targetTime,
        shouldContinuePlan: 2
    }
    fs.writeFileSync(filePath, JSON.stringify(_data));
}
async function planA() {  // 充电
    let chargeLevel = 0;
    try {
        await delay(1000)
        await processData(commandB);
        await delay(1000);
        await processData(command_PowerOn);
        await delay(11000);
        while (shouldContinuePlan === 1) {
            if (!allStatus) {
                isWriteStop()
                console.log('出现故障即将关机');
                break
            }
            currentDateTime = getCurrentDateTime();
            let currentDateTimeNow = getCurrentDateTime();
            let _isPlanA = targetTime.chargingTime.filter(item => {
                return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
            })
            if (_isPlanA.length <= 0) {
                clearInterval(hycc)
                startExecution()
                break
            }
            await processData(command_charging);
            try {
                const _msg = await withTimeout(handleAndReadCanMessages('can0', [0x1C405010]), 5000, 'CAN message timeout');
                const parts = _msg.data.toString('hex').match(/.{2}/g);
                const str = parts.join('');
                const result = str.substring(4, 8); // 分为 0-4 4-8 8-12 12-16
                const decimalResult = parseInt(result, 16);
                const canIdhyc = decimalToHex(_msg.id).substring(0, 5);
                const canId123 = '1c405010'.substring(0, 5);
                if (canIdhyc === canId123) {
                    if (decimalResult >= 3380) {
                        chargeLevel++;
                        switch (chargeLevel) {
                            case 1:
                                command_charging.data = -380;
                                await processData(command_charging);
                                console.log(`电量未充满...正在充电中... 进行修改功率: ${command_charging.data}当前电压:`, currentDateTime, decimalResult);
                                break;
                            case 2:
                                command_charging.data = -190;
                                await processData(command_charging);
                                console.log(`电量未充满...正在充电中... 进行修改功率: ${command_charging.data}当前电压:`, currentDateTime, decimalResult);
                                break;
                            case 3:
                                command_charging.data = -100;
                                await processData(command_charging);
                                console.log(`电量未充满...正在充电中... 进行修改功率: ${command_charging.data}当前电压:`, currentDateTime, decimalResult);
                                break;
                            case 4:
                                console.log('电量已充满', currentDateTime, decimalResult);
                                break;
                        }
                        await delay(5000);
                        if (chargeLevel >= 3) {
                            console.log('电量已充满', currentDateTime, decimalResult);
                            isWriteStop()
                            break;
                        }
                    } else {
                        console.log('电量未充满...正在充电中... 当前电压:', currentDateTime, decimalResult);
                        await delay(5000);
                    }
                } else {
                    console.log('发送和接收的canId不一致');
                    process.exit(1);
                }
            } catch (error) {
                console.error('处理CAN消息时出现错误:', error);
                await delay(5000)
                continue;
            }
        }
        console.log('@@@planA');
        await processData(command_PowerDown);
        await delay(2000);
    } catch (error) {
        console.error('处理数据时出现错误:', error);
        process.exit(1);
    }
}
async function planB() { // 放电
    try {
        await delay(1000);
        await processData(commandB);
        await delay(1000);
        await processData(command_PowerOn);
        await delay(11000);
        while (shouldContinuePlan === 1) {
            if (!allStatus) {
                isWriteStop()
                console.log('出现故障即将关机');
                break
            }
            currentDateTime = getCurrentDateTime();
            let currentDateTimeNow = getCurrentDateTime();
            let _isPlanB = targetTime.dischargeTime.filter(item => {
                return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
            })
            if (_isPlanB.length <= 0) {
                console.log('planB break hyc');
                clearInterval(hycc)
                startExecution()
                break
            }
            await processData(command_discharge);
            console.log('功率写入');
            try {
                const _msg = await withTimeout(handleAndReadCanMessages('can0', [0x1C406010]), 5000, 'CAN message timeout');
                console.log(_msg, 'can回复');
                const parts = _msg.data.toString('hex').match(/.{2}/g);
                const str = parts.join('');
                const result = str.substring(12, 16);
                const decimalResult = parseInt(result, 16);
                const canIdhyc = decimalToHex(_msg.id).substring(0, 5);
                const canId123 = '1c406010'.substring(0, 5);
                if (canIdhyc === canId123) {
                    if (decimalResult <= 3005) {
                        await processData(command_PowerDown);
                        console.log('电量已放完', currentDateTime, decimalResult);
                        await delay(5000)
                        isWriteStop()
                        break;
                    } else {
                        console.log('电量未放完...正在放电中... 当前电压:', currentDateTime, decimalResult);
                        await delay(5000);
                    }
                } else {
                    console.log('发送和接收的canId不一致');
                    process.exit(1);
                }
            } catch (error) {
                console.error('处理CAN消息时出现错误:', error);
                await delay(5000)
                continue; // continue会继续往下走 走下一次的循环 因为出现超时的情况 所以可以允许超时现象的出现
            }
        }
        console.log('@@@planB');
        await processData(command_PowerDown);
        await delay(2000);
    } catch (error) {
        console.error('处理数据时出现错误:', error);
        process.exit(1);
    }
}
async function executePlanA() {
    await planA();
}
async function executePlanB() {
    await planB();
}
let hyc = null
async function startExecution() {
    console.log('111打印111');
    startTimewatch()
    await readAllCanMessagesAtInterval1(canIdshyc)
    await startDataFetching();
    if (!allStatus) {
        isWriteStop()
        console.log('出现故障即将关机');
        return
    }

    let currentDateTimeNow = getCurrentDateTime();
    let _isPlanA = targetTime.chargingTime.filter(item => {
        return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
    })
    let _isPlanB = targetTime.dischargeTime.filter(item => {
        return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
    })
    if (_isPlanA.length > 0 || _isPlanB.length > 0) {
        if (_isPlanA.length > 0) {
            executePlanA();
        }
        if (_isPlanB.length > 0) {
            executePlanB();
        }
        return
    } else {
        hyc = setInterval(() => {
            if (!allStatus) {
                isWriteStop()
                console.log('出现故障即将关机');
                return
            }
            let currentDateTimeNow = getCurrentDateTime();
            let _isPlanA = targetTime.chargingTime.filter(item => {
                return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
            })
            let _isPlanB = targetTime.dischargeTime.filter(item => {
                return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
            })
            if (_isPlanA.length > 0 || _isPlanB.length > 0) {
                clearInterval(hyc)
                if (_isPlanA.length > 0) {
                    executePlanA();
                }
                if (_isPlanB.length > 0) {
                    executePlanB();
                }
            }
        }, 30000);
    }
}
module.exports = { startDataFetching, readAllCanMessagesAtInterval1, startExecution, changePlan, getShouldContinuePlan };