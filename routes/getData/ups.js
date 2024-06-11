const initializeSerialPort = require('../../model/system/serialportHandler');
const port232 = initializeSerialPort('/dev/ttyS3', 2400);
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
		}, 'customDelimiter'); // 使用自定义解析器
	});
}
async function handleAndReadMessages(messages) {
	try {
		const responses = await Promise.all(messages.map(async message => {
			return await sendMessage(message);
		}));
		const currentData = responses.map(response => bufferToAscii(response));
		console.log('UPS所有数据—>', currentData, getCurrentDateTimeFormatted());
		return currentData
	} catch (error) {
		console.error('处理和读取消息时出现错误：', error);
		process.exit(1);
	}
}
module.exports = { handleAndReadMessages };

