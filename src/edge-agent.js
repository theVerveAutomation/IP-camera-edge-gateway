const io = require('socket.io-client');
const axios = require('axios');
const { cloudUrl, RTMP_PUBLISH_URL, GO2RTC_API, EDGE_ID } = require('./config');
const { startEdgeAgent } = require('./index');

const socket = io(cloudUrl);

console.log('Connecting to Cloud at', cloudUrl);

socket.on('connect', () => {
    console.log('Connected to Cloud');
    socket.emit('register_edge', EDGE_ID);
});

socket.on('edge_registered', (data) => {
    console.log('Edge Gateway registered successfully with Cloud');
    startEdgeAgent(data);
});

// HANDLER: Start Stream
socket.on('cmd_stream_push', async ({ camId, ingestPath }) => {
    // const streamName = `relay_${camId}`;
    const cloud_ingestURL = `${RTMP_PUBLISH_URL}/${ingestPath}`;

    console.log(`[${camId}] Starting Relay to Cloud...`);
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
        socket.emit('relay_info', { success: true, data: { CameraId: camId, url: cloud_ingestURL } });
    } catch (err) {
        console.error(`[${camId}] Failed to start:`, err.message);
        socket.emit('relay_info', { success: false, data: err.message });
    }
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






