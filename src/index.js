const { addStream } = require('./stream-manager');
const config = require('./config');
const { checkGo2rtcHealth } = require('./utils/healthCheck');

async function startEdgeAgent() {
    console.log('Starting Edge Gateway Agent...');
    console.log(`Loaded : ${config.camerasJson}`);
    for (const cam of config.camerasJson) {
        await addStream(cam.name, cam.rtsp_url || cam.host);
    }

    // Health monitoring
    setInterval(async () => {
        const healthy = await checkGo2rtcHealth();
        if (!healthy) console.error('go2rtc is down!');
    }, 10000);
}

startEdgeAgent();
