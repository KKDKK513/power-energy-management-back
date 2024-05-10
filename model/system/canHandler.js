const can = require('socketcan');
function handleCanMessages(channelName, canId) {
    const channel = can.createRawChannel(channelName, true);
    channel.start();
    channel.addListener('onError', function (error) { // 监测错误
        console.error('CAN Channel Error:', error);
        process.exit(1);
    });
    return {
        read: function (callback) {
            channel.addListener("onMessage", function (msg) {
                if (msg.rtr) {
                } else {
                    callback(msg);
                }
            });
        },
        send: function () {
            const remoteFrameMessage = {
                id: canId,
                ext: true,
                rtr: true, // 远程帧
                data: Buffer.from([])
            };
            channel.send(remoteFrameMessage);
        },
        send1: function (dataToSend) { // 发送写的数据
            const remoteFrameMessage = {
                id: canId,
                ext: true,
                rtr: false, // 数据帧
                data: Buffer.from(dataToSend)
            };
            channel.send(remoteFrameMessage);
        }
    }
}
module.exports = handleCanMessages;