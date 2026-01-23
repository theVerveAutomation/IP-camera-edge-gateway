const { addStream } = require('./services/stream-manager');
const { checkGo2rtcHealth } = require('./utils/healthCheck');
const RunSnapshot = require('./scheduler/snapshot.job');

let cameras_data = [];

async function startEdgeAgent(cameras) {
    console.log('Starting Edge Gateway Agent...');

    // Initialize streams from config
    // for (const cam of camerasJson) {
    //     console.log(`Adding stream for organization: ${cam.organizations.displayid} camera: ${cam.name} at ${cam.rtsp_url}`);
    //     await addStream(cam.name, cam.rtsp_url);
    // }
    // }
    cameras_data = Array.isArray(cameras.data) ? cameras.data : [cameras.data];
    console.log('Cameras Configured:', cameras_data);

    for (const cam of cameras_data) {
        console.log(`Adding stream for organization: ${cam.organizations?.displayid} camera: ${cam.name} at ${cam.url}`);
        await addStream(cam.name, cam.url);
    }

    RunSnapshot(cameras_data);
    // Health monitoring
    setInterval(async () => {
        const healthy = await checkGo2rtcHealth();
        if (!healthy) console.error('go2rtc is down!');
    }, 5000);
}

module.exports = { startEdgeAgent };

