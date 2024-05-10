const { exec } = require('child_process');
const configureCan0Interface = () => {
    exec('ip link set can0 down', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });

    exec('ip link set can0 type can bitrate 250000', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });

    exec('ip link set can0 up', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}
const configureCan1Interface = () => {
    exec('ip link set can1 down', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });

    exec('ip link set can1 type can bitrate 250000', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });

    exec('ip link set can1 up', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}
module.exports = {
    configureCan0Interface,
    configureCan1Interface
};
