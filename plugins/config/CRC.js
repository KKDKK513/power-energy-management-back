function createModbusRTUMessage(deviceAddress, functionCode, registerAddress, registerCount) {
    // 创建一个包含设备地址、功能码、寄存器地址和寄存器数量的数组
    const messageArray = [deviceAddress, functionCode, registerAddress >> 8, registerAddress & 0xFF, registerCount >> 8, registerCount & 0xFF];
    // 计算CRC校验码
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
    // 将所有数据合并到一个数组
    const fullMessageArray = messageArray.concat(Array.from(crcBuffer));
    // 创建并返回包含所有数据的Buffer对象
    return Buffer.from(fullMessageArray);
  }
  module.exports = createModbusRTUMessage;
  