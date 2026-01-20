require('dotenv').config();
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    cloudUrl: process.env.CLOUD_URL,
    camerasJson: JSON.parse(process.env.CAMERAS_JSON || '[]'),
    CLOUD_URL: 'http://host.docker.internal:3000',
    GO2RTC_API: 'http://go2rtc:1984/api',
    EDGE_ID: 'org_123_site_A' // Hardcoded or env variable
};
