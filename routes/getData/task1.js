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
    data: -200
};
const command_discharge = {
    address: '0x0D57',
    data: 100
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
    0x1C100010, 0x1C101010, 0x1C102010, 0x1C103010, 0x1C104010, 0x1C105010, 0x1C106010, 0x1C107010, 0x1C108010, 0x1C109010, 0x1C10A010, 0x1C10B010, 0x1C10C010, 0x1C10D010, 0x1C10E010, 0x1C10F010, 0x1C110010, 0x1C111010, 0x1C112010, 0x1C113010, 0x1C114010, 0x1C115010, // 可读
    0x1C116010, 0x1C117010, 0x1C118010, 0x1C119010, 0x1C11A010, 0x1C11B010, 0x1C11C010, 0x1C11D010, 0x1C11E010, 0x1C11F010, 0x1C120010, 0x1C121010, 0x1C122010, 0x1C123010, 0x1C124010, 0x1C125010, 0x1C126010, 0x1C127010, 0x1C128010, 0x1C129010, 0x1C12A010, 0x1C12B010, // 可读
    0x1C12C010, 0x1C12D010, 0x1C12E010, 0x1C12F010, 0x1C130010, 0x1C131010, 0x1C132010, 0x1C133010, 0x1C134010, 0x1C135010, 0x1C136010, 0x1C137010, 0x1C138010, 0x1C139010, 0x1C13A010, 0x1C13B010, 0x1C200010, 0x1C201010, 0x1C202010, 0x1C203010, 0x1C204010, 0x1C205010, // 可读
    0x1C206010, 0x1C207010, 0x1C208010, 0x1C209010, 0x1C20A010, 0x1C20B010, 0x1C20C010, 0x1C20D010, 0x1C20E010, 0x1C20F010, 0x1C210010, 0x1C211010, 0x1C212010, 0x1C213010, 0x1C214010, 0x1C215010, // 可读
    0x1C216010, 0x1C217010, 0x1C218010, 0x1C219010, 0x1C21A010, 0x1C21B010, 0x1C21C010, 0x1C21D010, 0x1C21E010, 0x1C21F010, 0x1C220010, 0x1C221010, 0x1C222010, 0x1C223010, 0x1C224010, 0x1C225010, 0x1C226010, 0x1C227010, 0x1C228010, 0x1C229010, 0x1C22A010, 0x1C22B010, // 可读
    0x1C22C010, 0x1C22D010, 0x1C22E010, 0x1C22F010, 0x1C230010, 0x1C231010, 0x1C232010, 0x1C233010, 0x1C234010, 0x1C235010, 0x1C236010, 0x1C237010, 0x1C238010, 0x1C239010, 0x1C23A010, 0x1C23B010, // 可读
    0x1C800010, 0x1C804010, 0x1C808010, 0x1C809010, 0x1C82D010, 0x1C830010, 0x1C837010, 0x1C838010, 0x1C839010
];
function checkAlarmStatus(alarmList) { // 检查故障状态
    let alarmStatus = false;
    for (let alarm of alarmList) {
        if (alarm !== '0000000000000000') {
            alarmStatus = true;
            break;
        }
    }
    return alarmStatus;
}
function checkAlarmStatus1(alarmList) { // 检查故障状态 pcs air
    let alarmStatus = false;
    for (let alarm of alarmList) {
        if (alarm !== '0103020000b844') {
            alarmStatus = true;
            break;
        }
    }
    return alarmStatus;
}
function checkAlarmStatusBcu(alarmList) { // 检查故障状态 bcu
    let alarmStatus = false;
    for (let alarm of alarmList) {
        if (alarm !== '0000000000000000') {
            alarmStatus = true;
            break;
        }
    }
    return alarmStatus;
}
async function readAllCanMessagesAtInterval(canIds) {
    let alarmStatus;
    let currentData = [];
    let currentData405 = [];
    let currentData406 = [];
    let currentData40D = [];
    let currentData415 = [];
    let currentData401 = [];
    let currentData400 = [];
    let currentAlarm = [];
    let currentData0x1C000010 = [];
    let currentData0x1C001010 = [];
    let currentData0x1C002010 = [];
    let currentData0x1C003010 = [];
    let results = {};  // 创建一个空对象用于保存结果
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
                const formattedResult = resSecondLastBit === '1' ? '0x01' : '0x00'; // 可能会把单引号去掉 记录一下
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
            } else if (canId === 0x1C000010) { // 暂时读不出来
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
                currentAlarm = [...currentData0x1C000010, ...currentData0x1C001010, ...currentData0x1C002010, ...currentData0x1C003010]
                alarmStatus = checkAlarmStatus(currentAlarm)
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
let _pcsAlarm, _airAlarm, _bcuAlarm, pcsStatus, airStatus, bcuStatus, allStatus, currentDateTime
async function startDataFetching() { // 这个方法会不会五秒执行一次
    const { results, currentData } = await readAllCanMessagesAtInterval(canIds);
    highestCellVoltage = results['0x1C405010']; // 最高单体电压
    lowestCellVoltage = results['0x1C406010']; // 最低单体电压
    soc = results['0x1C40D010'].soc; // soc
    soh = results['0x1C40D010'].soh; // soh
    mainPositiveRelay = results['0x1C415010']; // 总正继电器状态
    totalVoltage = results['0x1C401010']; // B+总压 总电压
    chargeDischargeCurrent = results['0x1C400010']; // 总充放电电流
    batteryStatus = results['0x1C400010111']; // 充放电状态
    readAllCan1MessagesAtInterval()
    readAllCan1MessagesAtInterval1()
    readAllCan1MessagesAtInterval2()
    readAllCan1MessagesAtInterval3()
    setInterval(async () => {
        try {
            const { results, currentData } = await readAllCanMessagesAtInterval(canIds);
            highestCellVoltage = results['0x1C405010']; // 最高单体电压
            lowestCellVoltage = results['0x1C406010']; // 最低单体电压
            soc = results['0x1C40D010'].soc; // soc
            soh = results['0x1C40D010'].soh; // soh
            mainPositiveRelay = results['0x1C415010']; // 总正继电器状态
            totalVoltage = results['0x1C401010']; // B+总压 总电压
            chargeDischargeCurrent = results['0x1C400010']; // 总充放电电流
            batteryStatus = results['0x1C400010111']; // 充放电状态
            readAllCan1MessagesAtInterval()
            readAllCan1MessagesAtInterval1()
            readAllCan1MessagesAtInterval2()
            readAllCan1MessagesAtInterval3()
        } catch (error) {
            console.error('Error:', error);
        }
    }, 2000);
}

function handleAndReadCanMessagesNew(channelName, canId, canData) { // 写
    return new Promise(async (resolve, reject) => {
        const handler = handleCanMessages(channelName, canId);
        handler.send1(canData); // 我想让这行代码在某些条件去掉变成只读
        handler.read(function (data) {
            resolve(data);
        });
    });
}
async function readAllCan1MessagesAtInterval() {
    let firstPart = '0x' + highestCellVoltage.substring(0, 2); // 有问题加await delay(1000);
    let secondPart = '0x' + highestCellVoltage.substring(2);
    let thirdPart = '0x' + lowestCellVoltage.substring(0, 2);
    let fourPart = '0x' + lowestCellVoltage.substring(2);
    const canData = [firstPart, secondPart, thirdPart, fourPart, soc, soh, 0x00, mainPositiveRelay];
    await handleAndReadCanMessagesNew("can1", 0x180150F1, canData);
}
async function readAllCan1MessagesAtInterval1() {
    let firstPart1 = '0x' + totalVoltage.substring(0, 2);
    let secondPart2 = '0x' + totalVoltage.substring(2);
    let thirdPart3 = '0x' + chargeDischargeCurrent.substring(0, 2);
    let fourPart4 = '0x' + chargeDischargeCurrent.substring(2);
    const canData1 = [firstPart1, secondPart2, thirdPart3, fourPart4, 0x8F, 0xE4, 0x70, 0x1C]; // 8FE4对应-28700补码
    await handleAndReadCanMessagesNew("can1", 0x180250F1, canData1);
}
async function readAllCan1MessagesAtInterval2() {
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
    const canData3 = [status, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]; // 对应 0 1 4 5
    await handleAndReadCanMessagesNew("can1", 0x180650F1, canData3);
}
async function readAllCan1MessagesAtInterval3() {
    const canData4 = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    await handleAndReadCanMessagesNew("can1", 0x180750F1, canData4);
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
        await delay(15000);
        const hexData = msg.data.toString('hex');
        const parts = hexData.match(/.{2}/g);
        const canIdhyc = decimalToHex(msg.id).substring(0, 5);
        const canId123 = decimalToHex(canId).substring(0, 5);
        if (canId === 0x1C8E7010 || canId === 0x1C8E8010) { // 需要判断并簇/退簇
            await delay(15000);
            const canIdOutIn = [0x1C414010]
            const _readMsg = await handleAndReadCanMessages('can0', canIdOutIn)
            const readMsg = _readMsg.data.toString('hex').match(/.{2}/g);
            const canReadId = decimalToHex(_readMsg.id).substring(0, 5);
            const _canReadId = decimalToHex(canIdOutIn).substring(0, 5);
            if (canIdhyc === canId123) {
                currentData.push(parts.join(''));
                currentReadData.push(readMsg.join(''))
                processedCanIds++;
                if (processedCanIds === canIds.length) {
                    console.log("修改之后的bcu数据:", currentData);
                    console.log('读取并簇/退簇状态:', currentReadData);
                    const resultsBing = Buffer.from([0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).toString('hex')
                    const resultsTui = Buffer.from([0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00]).toString('hex')
                    if (canId === 0x1C8E7010) {
                        if (resultsBing === currentReadData[0]) {
                            console.log('并簇成功');
                            return
                        } else {
                            console.log('并簇失败 请重试'); // 可能有问题 是五一前最后一天下午加的 后续可能还需要加失败判断
                        }
                    } else if (canId === 0x1C8E8010) {
                        if (resultsTui === currentReadData[0]) {
                            console.log('退簇成功');
                            return
                        } else {
                            console.log('退簇失败 请重试');  // 可能有问题 是五一前最后一天下午加的 后续可能还需要加失败判断
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

let relativePathshouldContinuePlan = '../../plugins/time.txt';
let filePathshouldContinuePlan = path.join(__dirname, relativePathshouldContinuePlan);
let _shouldContinuePlan = fs.readFileSync(filePathshouldContinuePlan);
_shouldContinuePlan = JSON.parse(_shouldContinuePlan)
let shouldContinuePlan = _shouldContinuePlan.shouldContinuePlan
function changePlan(num) {
    console.log('num', num);
    shouldContinuePlan = num
}

async function planA() {  // 待机-充电-关机
    let chargeLevel = 0;
    try {
        console.log('shouldContinuePlan', shouldContinuePlan);
        while (shouldContinuePlan === 1) {
            currentDateTime = getCurrentDateTime();
            let currentDateTimeNow = getCurrentDateTime();
            const relativePath = '../../plugins/time.txt';
            const filePath = path.join(__dirname, relativePath);
            let _targetTime = fs.readFileSync(filePath);
            _targetTime = JSON.parse(_targetTime)
            let _isPlanA = _targetTime.chargingTime.filter(item => {
                return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
            })
            if (_isPlanA.length <= 0) {
                startExecution()
                break
            }
            await delay(2000)
            await processData(commandB); // 并网
            await delay(2000);
            await processData(command_PowerOn);  // 开机
            await delay(11000);
            await processData(command_charging);
            await delay(2000);
            const _msg = await handleAndReadCanMessages('can0', [0x1C405010]);
            const parts = _msg.data.toString('hex').match(/.{2}/g);
            const str = parts.join('');
            const result = str.substring(4, 8);
            const decimalResult = parseInt(result, 16);
            const canIdhyc = decimalToHex(_msg.id).substring(0, 5);
            const canId123 = '1c405010'.substring(0, 5);
            if (canIdhyc === canId123) {
                if (decimalResult >= 3335) {
                    chargeLevel++;
                    switch (chargeLevel) {
                        case 1:
                            command_charging.data = -100;
                            await processData(command_charging); // 更新充电功率
                            console.log(`电量未充满...正在充电中... 进行修改功率: ${command_charging.data}当前电压:`, currentDateTime, decimalResult);
                            break;
                        case 2:
                            command_charging.data = -50;
                            await processData(command_charging); // 更新充电功率
                            console.log(`电量未充满...正在充电中... 进行修改功率: ${command_charging.data}当前电压:`, currentDateTime, decimalResult);
                            break;
                        case 3:
                            console.log('电量已充满', currentDateTime, decimalResult);
                            break;
                    }
                    await delay(60000);
                    if (chargeLevel >= 3) {
                        console.log('电量已充满', currentDateTime, decimalResult);
                        break; // 达到三次后退出
                    }
                } else {
                    console.log('电量未充满...正在充电中... 当前电压:', currentDateTime, decimalResult);
                    await delay(60000);
                }
            } else {
                console.log('发送和接收的canId不一致');
                process.exit(1);
            }
        }
        console.log('@@@planA');
        await processData(command_PowerDown); // 关机
        await delay(2000);
    } catch (error) {
        console.error('处理数据时出现错误:', error);
        process.exit(1);
    }
}
async function planB() { // 待机-并网放电-关机 shouldContinuePlan放方法中作为参数
    try {
        while (shouldContinuePlan === 1) { // 手动停
            currentDateTime = getCurrentDateTime();
            let currentDateTimeNow = getCurrentDateTime();
            const relativePath = '../../plugins/time.txt';
            const filePath = path.join(__dirname, relativePath);
            let _targetTime = fs.readFileSync(filePath);
            _targetTime = JSON.parse(_targetTime)
            let _isPlanB = _targetTime.dischargeTime.filter(item => {
                return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
            })
            if (_isPlanB.length <= 0) {
                startExecution()
                break
            }
            await delay(2000);
            await processData(commandB); // 并网
            await delay(2000);
            await processData(command_PowerOn);  // 开机
            await delay(11000);
            await processData(command_discharge); // 追加三级告警判断 依次修改command_discharge 放电
            await delay(2000);
            const _msg = await handleAndReadCanMessages('can0', [0x1C406010]);
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
                    await delay(60000) // 这里可以最后判断电表时间   await planA() 放电之后开始充电
                    break;
                } else {
                    console.log('电量未放完...正在放电中... 当前电压:', decimalResult);
                    await delay(60000);
                }
            } else {
                console.log('发送和接收的canId不一致');
                process.exit(1);
            }
        }
        console.log('@@@planB');
        await processData(command_PowerDown); // 关机——>第三次放满电 / 暂停直接关机
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
    await readAllCanMessagesAtInterval1(canIdshyc)
    await startDataFetching(); // 一直有
    let currentDateTimeNow = getCurrentDateTime();
    console.log('计时器', currentDateTimeNow);
    const relativePath = '../../plugins/time.txt';
    const filePath = path.join(__dirname, relativePath);
    let _targetTime = fs.readFileSync(filePath);
    _targetTime = JSON.parse(_targetTime)
    let _isPlanA = _targetTime.chargingTime.filter(item => {
        return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1] // 将符合条件的那一项返回
    })
    let _isPlanB = _targetTime.dischargeTime.filter(item => {
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
        return
    } else {
        hyc = setInterval(() => {
            let currentDateTimeNow = getCurrentDateTime();
            console.log('计时器', currentDateTimeNow);
            const relativePath = '../../plugins/time.txt';
            const filePath = path.join(__dirname, relativePath);
            let _targetTime = fs.readFileSync(filePath);
            _targetTime = JSON.parse(_targetTime)
            let _isPlanA = _targetTime.chargingTime.filter(item => {
                return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1] // 将符合条件的那一项返回
            })
            let _isPlanB = _targetTime.dischargeTime.filter(item => {
                return currentDateTimeNow >= item.split('-')[0] && currentDateTimeNow <= item.split('-')[1]
            })
            if (_isPlanA.length > 0 || _isPlanB.length > 0) {
                shouldContinuePlan = 1
                clearInterval(hyc)
                if (_isPlanA.length > 0) {
                    executePlanA();
                }
                if (_isPlanB.length > 0) {
                    executePlanB();
                }
            } else {
                shouldContinuePlan = 2
            }

        }, 60000); // 时间可以再调小一点
    }
}
module.exports = { startDataFetching, readAllCanMessagesAtInterval1, startExecution, changePlan };