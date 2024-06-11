function createModbusRTUMessage(deviceAddress, functionCode, registerAddress, registerCount) {
    const messageArray = [deviceAddress, functionCode, registerAddress >> 8, registerAddress & 0xFF, registerCount >> 8, registerCount & 0xFF];
    let crc = 0xFFFF;
    for (let i = 0; i < messageArray.length; i++) {
        crc ^= messageArray[i];
  
        for (let j = 0; j < 8; j++) {
            if (crc & 0x0001) {
                crc = (crc >> 1) ^ 0xA001;
            } else {
                crc = crc >> 1;
            }
        }
    }
    const crcBuffer = Buffer.from([crc & 0xFF, crc >> 8]);
    const fullMessageArray = messageArray.concat(Array.from(crcBuffer));
    return Buffer.from(fullMessageArray);
  }
  module.exports = createModbusRTUMessage;
  