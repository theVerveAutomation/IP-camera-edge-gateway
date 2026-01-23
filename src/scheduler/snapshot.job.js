const cron = require('node-cron');
const { captureSnapshot } = require('../services/snapshot.service');

function RunSnapshot(cameras_data) {
    console.log("Scheduling snapshot capture job...");

    cron.schedule("0 * * * *", async () => {
        console.log("Starting scheduled snapshot capture...");
        for (const cam of cameras_data) {
            console.log(`Capturing snapshot for camera: ${cam.name}`);
            await captureSnapshot(cam.id, cam.name, cam.url);
        }
    });
}

module.exports = RunSnapshot;
