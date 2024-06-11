const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const { DelimiterParser } = require('@serialport/parser-delimiter');

const { Transform } = require('stream');

class CustomDelimiterParser extends Transform {
	constructor(delimiter) {
		super();
		this.delimiter = delimiter;
		this.buffer = Buffer.alloc(0);
	}

	_transform(chunk, encoding, callback) {
		let data = Buffer.concat([this.buffer, chunk]);
		let index;
		while ((index = data.indexOf(this.delimiter)) !== -1) {
			let part = data.slice(0, index);
			if (part.length > 0) {
				this.push(part);
			}
			data = data.slice(index + this.delimiter.length);
		}
		this.buffer = data;
		callback();
	}

	_flush(callback) {
		if (this.buffer.length > 0) {
			this.push(this.buffer);
			this.buffer = Buffer.alloc(0);
		}
		callback();
	}
}

function initializeSerialPort(path, baudRate) {
	const port = new SerialPort({ path, baudRate });
	const customDelimiter = Buffer.from('~');
	const parsers = {
		byteLength7: new ByteLengthParser({ length: 7 }),
		byteLength8: new ByteLengthParser({ length: 8 }),
		delimiter: new DelimiterParser({ delimiter: customDelimiter }), // 原始delimiter解析器
		customDelimiter: new CustomDelimiterParser(customDelimiter) // 添加自定义解析器
	};
	let activeParserType = 'byteLength7';  // 默认解析器
	let activeParser = parsers[activeParserType];
	port.pipe(activeParser);

	function switchParser(parserType) {
		if (parserType in parsers) {
			if (activeParserType !== parserType) {
				port.unpipe().pipe(parsers[parserType]);
				activeParserType = parserType;
				console.log(`Switched to parser: ${parserType}`);
			}
		} else {
			console.error("Parser type not supported:", parserType);
		}
	}

	port.on('error', err => {
		console.error(`Error from ${path}:`, err);
		process.exit(1);
	});

	let serialPortInstance = {
		port,
		switchParser,
		write: function (data) {
			port.write(data, err => {
				if (err) {
					console.error('Failed to send data:', err);
				}
			});
		},
		read: function (callback, parserType = 'byteLength7') {
			switchParser(parserType);
			parsers[parserType].once('data', callback);
		}
	};

	return serialPortInstance;
}

module.exports = initializeSerialPort;
