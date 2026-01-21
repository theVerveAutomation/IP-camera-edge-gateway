require('dotenv').config();
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    cloudUrl: process.env.CLOUD_URL,
    camerasJson: JSON.parse(process.env.CAMERAS_JSON || '[]'),
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseBucket: process.env.SUPABASE_BUCKET || 'camera-snapshots',
    CLOUD_URL: 'http://host.docker.internal:3000',
    GO2RTC_API: 'http://go2rtc:1984/api',
    EDGE_ID: 'org_123' // Hardcoded or env variable
};
