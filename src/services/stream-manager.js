const axios = require('axios');

const GO2RTC_API = 'http://go2rtc:1984/api/streams';

async function getAllStreams() {
    console.log('Fetching all streams from go2rtc...');
    try {
        const res = await axios.get(GO2RTC_API);
        console.log('Streams fetched:', res.data);
        return res.data;
    } catch (err) {
        console.error('Failed to get streams:', err.message);
        return [];
    }
}

async function addStream(name, rtspUrl) {
    try {
        const res = await axios.put(`http://go2rtc:1984/api/streams?src=${rtspUrl}&name=${name}`);
        console.log(`Stream ${name} added`);
        return res.data;
    } catch (err) {
        console.error('Failed to add stream:', err.message);
    }
}

async function removeStream(name) {
    try {
        const res = await axios.delete(`${GO2RTC_API}/${name}`);
        console.log(`Stream ${name} removed`);
        return res.data;
    } catch (err) {
        console.error('Failed to remove stream:', err.message);
    }
}

module.exports = { getAllStreams, addStream, removeStream };
