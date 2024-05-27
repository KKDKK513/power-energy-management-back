const can = require('socketcan');
function handleCanMessages(channelName, canId) {
	    const channel = can.createRawChannel(channelName, true);
	    channel.start();
	    return {
		            channel,
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
