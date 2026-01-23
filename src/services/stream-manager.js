const axios = require('axios');
const { GO2RTC_API } = require('../config');

const GO2RTC_API_STREAMS = `${GO2RTC_API}/streams`;

async function getAllStreams() {
    console.log('Fetching all streams from go2rtc...');
    try {
        const res = await axios.get(GO2RTC_API_STREAMS);
        console.log('Streams fetched:', res.data);
        return res.data;
    } catch (err) {
        console.error('Failed to get streams:', err.message);
        return [];
    }
}

async function addStream(name, url) {
    try {
        const res = await axios.put(`${GO2RTC_API_STREAMS}?src=${url}&name=${name}`);
        console.log(`Stream ${name} added`);
        return res.data;
    } catch (err) {
        console.error('Failed to add stream:', err.message);
    }
}

async function removeStream(name) {
    try {
        const res = await axios.delete(`${GO2RTC_API_STREAMS}?name=${name}`);
        console.log(`Stream ${name} removed`);
        return res.data;
    } catch (err) {
        console.error('Failed to remove stream:', err.message);
    }
}

module.exports = { getAllStreams, addStream, removeStream };
