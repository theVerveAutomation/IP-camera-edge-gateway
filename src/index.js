const { exec } = require('child_process');
require('dotenv').config();


// Example function to pull RTSP and push to cloud
function streamCamera(rtspUrl, cloudUrl) {
    const cmd = `ffmpeg -hide_banner -i ${rtspUrl} -f flv ${cloudUrl}`;
    console.log("Executing command: " + cmd);
    const process = exec(cmd);
    process.stdout.on('data', data => console.log("stdout output: " + data));
    process.stderr.on('data', data => console.error("stderr error: " + data));
    process.on('exit', code => console.log(`Process exited with code ${code}`));
    process.on('error', err => console.error("Process error: " + err));
    process.on('close', code => console.log(`Process closed with code ${code}`));
}


// Example usage
const cameras_json = process.env.CAMERAS_JSON; // Use Cameras JSON from .env file


for (const camers of JSON.parse(cameras_json)) {
    streamCamera(camers.rtsp_url, camers.cloud_url);
}
// streamCamera(rtspUrl, cloudUrl);