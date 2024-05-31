const { exec } = require('child_process');

function setIPAddress(ipAddress, interface) {
	const command = `ip addr add ${ipAddress}/24 dev ${interface}`;
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`Stderr: ${stderr}`);
			return;
		}
		console.log(`Stdout: ${stdout}`);
		bringInterfaceUp(interface);
	});
}

function bringInterfaceUp(interface) {
	const command = `ifconfig ${interface} up`;
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`Stderr: ${stderr}`);
			return;
		}
		console.log(`Stdout: ${stdout}`);
	});
}

// const ipAddressFromFrontEnd = '169.254.31.228'; // 这里的 IP 地址可以通过用户输入或其他方式获得
// setIPAddress(ipAddressFromFrontEnd, 'eth0');
module.exports = {
    setIPAddress
};