const cron = require('node-cron');
const { captureSnapshot } = require('../services/snapshot.service');
const { camerasJson } = require('../config');

function RunSnapshot() {
    console.log("Scheduling snapshot capture job...");

    cron.schedule("0 * * * *", async () => {
        console.log("Starting scheduled snapshot capture...");
        for (const cam of camerasJson) {
            console.log(`Capturing snapshot for camera: ${cam.name}`);
            await captureSnapshot(cam.name, cam.rtsp_url);
        }
    });
}

module.exports = RunSnapshot;

