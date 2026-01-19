const cron = require('node-cron');
const { captureSnapshot } = require('../services/snapshot.service');

console.log("Scheduling snapshot capture job...");

cron.schedule("* * * * *", async () => {
    console.log("Starting scheduled snapshot capture...");
    for (const cam of require('../config').camerasJson) {
        console.log(`Capturing snapshot for camera: ${cam.name}`);
        await captureSnapshot(cam.name, cam.rtsp_url);
    }
});