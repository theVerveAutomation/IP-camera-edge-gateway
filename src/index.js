const { addStream, getAllStreams } = require('./services/stream-manager');
const { camerasJson } = require('./config');
const { checkGo2rtcHealth } = require('./utils/healthCheck');
const RunSnapshot = require('./scheduler/snapshot.job');

async function startEdgeAgent() {
    console.log('Starting Edge Gateway Agent...');

    // Initialize streams from config
    for (const cam of camerasJson) {
        console.log(`Adding stream for camera: ${cam.name} at ${cam.rtsp_url}`);
        await addStream(cam.name, cam.rtsp_url);
    }

    RunSnapshot();
    // Health monitoring
    setInterval(async () => {
        const healthy = await checkGo2rtcHealth();
        if (!healthy) console.error('go2rtc is down!');
    }, 10000);
}

// startEdgeAgent();

module.exports = { startEdgeAgent };

