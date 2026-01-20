const axios = require('axios');

const GO2RTC_API = 'http://go2rtc:1984/api/streams';

async function addStream(name, rtspUrl) {
    try {
        const res = await axios.post(GO2RTC_API, {
            name,
            src: rtspUrl
        });
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

module.exports = { addStream, removeStream };
