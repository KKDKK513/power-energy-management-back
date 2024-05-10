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
function decimalToHex(decimal) {
    return decimal.toString(16);
}
const canIdsSecond = [ // 灰色 85
    0x1C2C0010, 0x1C2C1010, 0x1C2C2010, 0x1C2C3010,
    0x1C300010, 0x1C301010, 0x1C302010, 0x1C303010, 0x1C304010, 0x1C305010, 0x1C306010, 0x1C307010, 0x1C308010, 0x1C309010, 0x1C30A010, 0x1C30B010, 0x1C30C010, 0x1C30D010, 0x1C30E010, 0x1C30F010, 0x1C310010, 0x1C311010, 0x1C312010, 0x1C313010, 0x1C314010, 0x1C315010, 0x1C316010, 0x1C317010, 0x1C318010, 0x1C319010, 0x1C31A010, 0x1C31B010, 0x1C31C010, 0x1C31D010, 0x1C31E010, 0x1C31F010, 0x1C320010, 0x1C321010, 0x1C322010, 0x1C323010, 0x1C324010, 0x1C325010, 0x1C326010, 0x1C327010, 0x1C328010, 0x1C329010, 0x1C32A010, 0x1C32B010, 0x1C32C010, 0x1C32D010, 0x1C32E010, 0x1C32F010, 0x1C330010, 0x1C331010, 0x1C332010, 0x1C333010, 0x1C334010, 0x1C335010, 0x1C336010, 0x1C337010, 0x1C338010, 0x1C339010, 0x1C33A010, 0x1C33B010,
    0x1C402010, 0x1C403010, 0x1C403010, 0x1C404010, 0x1C405010, 0x1C406010, 0x1C407010, 0x1C408010, 0x1C409010, 0x1C40A010, 0x1C40B010,
    0x1C40D010, 0x1C40E010, 0x1C40F010, 0x1C412010, 0x1C413010, 0x1C414010, 0x1C415010, 0x1C417010, 0x1C418010, 0x1C419010
];
const canIds = [ // 绿色 158
    0x1C000010, 0x1C001010, 0x1C002010, 0x1C003010,
    0x1C010010, 0x1C011010, 0x1C012010, 0x1C013010, 0x1C014010, 0x1C015010, 0x1C016010, 0x1C017010, 0x1C018010, 0x1C019010, 0x1C01A010, 0x1C01B010, 0x1C01C010, 0x1C01D010, 0x1C01E010,
    0x1C036010, 0x1C037010, 0x1C038010, 0x1C039010, 0x1C03A010, 0x1C03B010, 0x1C03C010, 0x1C03D010, 0x1C03E010, 0x1C03F010, 0x1C040010, 0x1C041010, 0x1C042010, 0x1C043010, 0x1C044010,
    0x1C05C010, 0x1C08A010, 0x1C100010, 0x1C101010, 0x1C102010, 0x1C103010, 0x1C104010, 0x1C105010, 0x1C106010, 0x1C107010, 0x1C108010, 0x1C109010, 0x1C10A010, 0x1C10B010, 0x1C10C010, 0x1C10D010, 0x1C10E010, 0x1C10F010, 0x1C110010, 0x1C111010, 0x1C112010, 0x1C113010, 0x1C114010, 0x1C115010,
    0x1C116010, 0x1C117010, 0x1C118010, 0x1C119010, 0x1C11A010, 0x1C11B010, 0x1C11C010, 0x1C11D010, 0x1C11E010, 0x1C11F010, 0x1C120010, 0x1C121010, 0x1C122010, 0x1C123010, 0x1C124010, 0x1C125010, 0x1C126010, 0x1C127010, 0x1C128010, 0x1C129010, 0x1C12A010, 0x1C12B010,
    0x1C12C010, 0x1C12D010, 0x1C12E010, 0x1C12F010, 0x1C130010, 0x1C131010, 0x1C132010, 0x1C133010, 0x1C134010, 0x1C135010, 0x1C136010, 0x1C137010, 0x1C138010, 0x1C139010, 0x1C13A010, 0x1C13B010, 0x1C200010, 0x1C201010, 0x1C202010, 0x1C203010, 0x1C204010, 0x1C205010,
    0x1C206010, 0x1C207010, 0x1C208010, 0x1C209010, 0x1C20A010, 0x1C20B010, 0x1C20C010, 0x1C20D010, 0x1C20E010, 0x1C20F010, 0x1C210010, 0x1C211010, 0x1C212010, 0x1C213010, 0x1C214010, 0x1C215010,
    0x1C216010, 0x1C217010, 0x1C218010, 0x1C219010, 0x1C21A010, 0x1C21B010, 0x1C21C010, 0x1C21D010, 0x1C21E010, 0x1C21F010, 0x1C220010, 0x1C221010, 0x1C222010, 0x1C223010, 0x1C224010, 0x1C225010, 0x1C226010, 0x1C227010, 0x1C228010, 0x1C229010, 0x1C22A010, 0x1C22B010,
    0x1C22C010, 0x1C22D010, 0x1C22E010, 0x1C22F010, 0x1C230010, 0x1C231010, 0x1C232010, 0x1C233010, 0x1C234010, 0x1C235010, 0x1C236010, 0x1C237010, 0x1C238010, 0x1C239010, 0x1C23A010, 0x1C23B010, 0x1C400010, 0x1C401010
];
const writeCanIds = [ // 56 控制命令
    0x1C800010, 0x1C801010, 0x1C802010, 0x1C803010, 0x1C804010, 0x1C808010, 0x1C809010, 0x1C82C010,
    0x1C82D010, 0x1C82E010, 0x1C82F010, 0x1C830010, 0x1C837010, 0x1C838010, 0x1C839010, 0x1C856010,
    0x1C857010, 0x1C858010, 0x1C859010, 0x1C85A010, 0x1C85B010, 0x1C85C010, 0x1C85D010, 0x1C85E010,
    0x1C85F010, 0x1C860010, 0x1C861010, 0x1C862010, 0x1C863010, 0x1C864010, 0x1C865010, 0x1C866010,
    0x1C867010, 0x1C868010, 0x1C869010, 0x1C86A010, 0x1C86B010, 0x1C86C010, 0x1C86D010, 0x1C86E010,
    0x1C86F010, 0x1C870010, 0x1C871010, 0x1C872010, 0x1C873010, 0x1C874010, 0x1C875010, 0x1C876010,
    0x1C877010, 0x1C878010, 0x1C879010, 0x1C87A010, 0x1C87B010, 0x1C87C010, 0x1C87D010, 0x1C8E4010
];
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
                console.log("所有BCU数据: ", currentData);
                return currentData
            }
        }
    }
}

// bcu写
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// const canSends = [
//     {
//         canIds: [0x1C8E7010],
//         canData: [0x00, 0x01]
//     },
//     {
//         canIds: [0x1C8E8010],
//         canData: [0x00, 0x02]
//     }
// ];
const canData0 = [0x00, 0x00] // 并簇 退簇之后需要写0
function decimalToHex(decimal) {
    return decimal.toString(16);
}
function handleAndReadCanMessages(channelName, canId) { // 读
    return new Promise((resolve, reject) => {
        const handler = handleCanMessages(channelName, canId);
        handler.send();
        handler.read(function (data) {
            resolve(data);
        });
    });
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
async function readAllCanMessagesAtInterval(canSend) { // 5.6传参
    let currentData = [];
    let currentReadData = []
    let processedCanIds = 0;
    for (const canId of canSend.canIds) {
        const msg = await handleAndReadCanMessagesNew("can0", canSend.canIds, canSend.canData);
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
                if (processedCanIds === canSend.canIds.length) {
                    console.log("修改之后的bcu数据:", currentData);
                    console.log('读取并簇/退簇状态:', currentReadData);
                    const resultsBing = Buffer.from([0x00, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).toString('hex')
                    const resultsTui = Buffer.from([0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00]).toString('hex')
                    if (canId === 0x1C8E7010) {
                        if (resultsBing === currentReadData[0]) {
                            console.log('并簇成功');
                            await handleAndReadCanMessagesNew("can0", canId, canData0) // 可能有问题 是五一前最后一天下午加的
                            return
                        } else {
                            console.log('并簇失败 请重试'); // 可能有问题 是五一前最后一天下午加的 后续可能还需要加失败判断
                        }
                    } else if (canId === 0x1C8E8010) {
                        if (resultsTui === currentReadData[0]) {
                            console.log('退簇成功');
                            await handleAndReadCanMessagesNew("can0", canId, canData0) // 可能有问题 是五一前最后一天下午加的
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
        } else {
            if (canIdhyc === canId123) {
                currentData.push(parts.join(''));
                processedCanIds++;
                if (processedCanIds === canSend.canIds.length) {
                    console.log("修改过后的数据: ", currentData); // 看看是否要与修改之前的数据进行比较
                }
            }
        }
    }
}
// 传多个
async function processAllCanSendsAtInterval(canSends) {
    for (const canSend of canSends) {
        await readAllCanMessagesAtInterval(canSend);
    }
}
// processAllCanSendsAtInterval(canSends);




module.exports = { readAllCanMessagesAtInterval, processAllCanSendsAtInterval };