const axios = require('axios');

async function checkGo2rtcHealth() {
    try {
        const res = await axios.get('http://go2rtc:1984/api/streams');
        return res.status === 200;
    } catch {
        return false;
    }
}

setInterval(async () => {
    const healthy = await checkGo2rtcHealth();
    if (!healthy) {
        console.error('go2rtc is down! Restarting...');
        // Use Docker API or process manager to restart
    } else {
        console.log('go2rtc is healthy');
    }
}, 10000000);
module.exports = { checkGo2rtcHealth };