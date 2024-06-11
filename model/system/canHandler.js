const can = require('socketcan');
const canChannels = {};
function getOrCreateChannel(channelName) {
    if (!canChannels[channelName]) {
        const channel = can.createRawChannel(channelName, true);
        channel.addListener("onMessage", (msg) => {
            if (!msg.rtr && channel.listeners[msg.id]) {
                channel.listeners[msg.id](msg);
            }
        });
        channel.start();
        channel.listeners = {}; // 存储每个ID的回调
        canChannels[channelName] = channel;
    }
    return canChannels[channelName];
}
function handleCanMessages(channelName, canId) {
    const channel = getOrCreateChannel(channelName);
    return {
        channel,
        read: function(callback) {
            channel.listeners[canId] = callback;
        },
        send: function(dataToSend = []) {
            const remoteFrameMessage = {
                id: canId,
                ext: true,
                rtr: true,
                data: Buffer.from(dataToSend)
            };
            channel.send(remoteFrameMessage);
        },
        send1: function(dataToSend) {
            const remoteFrameMessage = {
                id: canId,
                ext: true,
                rtr: false,
                data: Buffer.from(dataToSend)
            };
            channel.send(remoteFrameMessage);
        }
    };
}
module.exports = handleCanMessages;