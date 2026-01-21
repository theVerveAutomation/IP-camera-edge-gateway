const io = require('socket.io-client');
const axios = require('axios');
const { CLOUD_URL, GO2RTC_API, EDGE_ID } = require('./config');
const { startEdgeAgent } = require('./index');

const socket = io(CLOUD_URL);

console.log('Connecting to Cloud at', CLOUD_URL);

socket.on('connect', () => {
    console.log('Connected to Cloud');
    socket.emit('register_edge', EDGE_ID);
});

socket.on('edge_registered', () => {
    console.log('Edge Gateway registered successfully with Cloud');
    startEdgeAgent();
});

// HANDLER: Start Stream
socket.on('cmd_stream_push', async ({ camId, ingestUrl }) => {
    // const streamName = `relay_${camId}`;
    const cloud_ingestURL = `${CLOUD_URL}/${ingestUrl}`;

    console.log(`[${camId}] Starting Relay to Cloud...`);

    // The FFmpeg Command:
    // 1. -i rtsp://... : Read from local camera (via Go2RTC loopback or direct IP)
    // 2. -c copy       : Do NOT re-encode video (Low CPU usage)
    // 3. -f flv        : Format required for RTMP
    // const ffmpegCmd = `exec:ffmpeg -i rtsp://127.0.0.1:8554/${camId} -c copy -f flv ${ingestUrl}`;
    // console.log(`[${camId}] FFmpeg Command: ${ffmpegCmd}`);
    // console.log(`relay: ${streamName}`);
    console.log(`[${camId}] Ingest URL: ${cloud_ingestURL}`);
    try {
        const res = await axios.post(`${GO2RTC_API}/streams`, null, {
            params: {
                src: camId,
                dst: cloud_ingestURL
            }
        });
        console.log(`[${camId}] go2rtc Response:`, JSON.stringify(res.data));
        console.log(`[${camId}] Stream Active`);
    } catch (err) {
        console.error(`[${camId}] Failed to start:`, err.message);
    }
    // try {
    //     // We use PUT to create/update the stream configuration dynamically
    //     const res = await axios.put(`${GO2RTC_API}/streams`, {
    //         params: {
    //             src: ffmpegCmd,
    //             name: streamName
    //         }
    //     });
    //     console.log(`[${camId}] go2rtc Response:`, JSON.stringify(res.data));
    //     console.log(`[${camId}] Stream Active`);
    // } catch (err) {
    //     console.error(`[${camId}] Failed to start:`, err.message);
    // }
});

// HANDLER: Stop Stream
socket.on('cmd_stream_stop', async ({ camId }) => {
    const streamName = `relay_${camId}`;
    console.log(`[${camId}] Stopping Relay...`);

    try {
        // DELETE removes the config and kills the FFmpeg process
        await axios.delete(`${GO2RTC_API}/streams`, {
            params: { src: streamName }
        });
        console.log(`[${camId}] Stream Stopped`);
    } catch (err) {
        console.error(`[${camId}] Failed to stop:`, err.message);
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from Cloud');
});






