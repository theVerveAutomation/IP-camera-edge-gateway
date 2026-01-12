const { spawn } = require('child_process');
require('dotenv').config();


// Example function to pull RTSP and push to cloud
function streamCamera(camera_name, rtspUrl, cloudUrl) {
    // const cmd = `ffmpeg -hide_banner -rtsp_transport tcp -i ${rtspUrl} -c copy output${camera_name}.mp4`;
    const args = [
        '-hide_banner',
        '-rtsp_transport', 'tcp',
        '-i', rtspUrl,
        '-vcodec', 'libx264', //-vcodec h264_vaapi (Intel GPU), -vcodec h264_nvenc (NVIDIA GPU)
        '-preset', 'ultrafast', '-tune', 'zerolatency',
        '-vf', 'scale=1280:720,fps=25',
        '-an', '-f', 'flv', cloudUrl
    ];
    const ffmpeg = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    console.log(`Executing command for ${camera_name}:  ${'ffmpeg ' + args.join(' ')}`);

    ffmpeg.stdout.on('data', (data) => {
        console.log(`STDOUT [${camera_name.trim()}]: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.log(`STDERR [${camera_name.trim()}]: ${data}`);
    })

    ffmpeg.on('close', (code) => {
        console.log(`FFMPEG process for ${camera_name.trim()} exited with code ${code}`);
    });

    ffmpeg.on('error', (err) => {
        console.error(`Failed to start FFMPEG process for ${camera_name.trim()}: ${err}`);
    });

    ffmpeg.on('exit', (code, signal) => {
        console.log(`FFMPEG process for ${camera_name.trim()} exited with code ${code} and signal ${signal}`);
    });
}


// Example usage
const cameras_json = process.env.CAMERAS_JSON; // Use Cameras JSON from .env file


for (const camers of JSON.parse(cameras_json)) {
    streamCamera(camers.name, camers.rtsp_url, camers.cloud_url);
}
// streamCamera(rtspUrl, cloudUrl);