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
				console.log("所有BCU数据: ", currentData, getCurrentDateTimeFormatted());
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
async function processAllCanSendsAtInterval(canSends) {
	for (const canSend of canSends) {
		await readAllCanMessagesAtIntervalNew(canSend);
	}
}
module.exports = { readAllCanMessagesAtInterval, processAllCanSendsAtInterval };