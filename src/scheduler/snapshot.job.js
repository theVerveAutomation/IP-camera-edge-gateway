const cron = require('node-cron');
const { capureSnapshot } = require('../services/snapshot.service');

cron.schedule("0 * * * *", async () => {
    console.log("Starting scheduled snapshot capture...");
    for (const cam of require('../config').camerasJson) {
        console.log(`Capturing snapshot for camera: ${cam.name}`);
        await capureSnapshot(cam.name, cam.rtsp_url);
    }
});