const { addStream } = require('./stream-manager');
const config = require('./config');
const { checkGo2rtcHealth } = require('./utils/healthCheck');

async function startEdgeAgent() {
    console.log('Starting Edge Gateway Agent...');
    for (const cam of config.camerasJson) {
        console.log(`Adding stream for camera: ${cam.name} at ${cam.rtsp_url}`);
        await addStream(cam.name, cam.rtsp_url);
    }

    // Health monitoring
    setInterval(async () => {
        const healthy = await checkGo2rtcHealth();
        if (!healthy) console.error('go2rtc is down!');
    }, 10000);
}

// startEdgeAgent();
