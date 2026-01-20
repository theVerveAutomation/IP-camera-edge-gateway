const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function captureSnapshot(cameraName, rtspUrl) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotDir = path.join(__dirname, '..', 'snapshots');

    if (!fs.existsSync(snapshotDir)) {
        fs.mkdirSync(snapshotDir, { recursive: true });
    }

    const snapshotPath = path.join(snapshotDir, `${cameraName}_${timestamp}.jpg`);

    const ffmpegCommand = `ffmpeg -y -rtsp_transport tcp -i ${rtspUrl} -frames:v 1 -q:v 2 ${snapshotPath}`;

    exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error capturing snapshot for ${cameraName}: ${error.message}`);
            return;
        }
        console.log(`${stdout}. Snapshot saved for ${cameraName} at ${snapshotPath}`);
    });
}

module.exports = { captureSnapshot };