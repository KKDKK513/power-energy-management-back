const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const { DelimiterParser } = require('@serialport/parser-delimiter');
function initializeSerialPort(path, baudRate) {
    const port = new SerialPort({ path, baudRate });
    let activeParser = null;
    function switchParser(parserType) {
        if (activeParser) {
            port.unpipe(activeParser);
            activeParser.removeAllListeners('data');
        }
        switch (parserType) {
            case 'byteLength7':
                activeParser = new ByteLengthParser({ length: 7 });
                break;
            case 'byteLength8':
                activeParser = new ByteLengthParser({ length: 8 });
                break;
            case 'delimiter':
                activeParser = new DelimiterParser({ delimiter: '~' });
                break;
        }
        port.pipe(activeParser);
        return activeParser;
    }
    port.on('error', err => {
        console.error(`来自${path}的数据有问题，错误信息：`, err);
        process.exit(1);
    });
    let serialPortInstance = {
        port,
        write: function (data) {
            port.write(data, err => {
                if (err) {
                    console.error('数据发送失败：', err);
                }
            });
        },
        read: function (callback, parserType = 'byteLength7') {
            const parser = switchParser(parserType);
            parser.once('data', callback); // once只读一次
        },
    };
    return serialPortInstance;
}
module.exports = initializeSerialPort;