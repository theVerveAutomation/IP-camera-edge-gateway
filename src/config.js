require('dotenv').config();
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    cloudUrl: process.env.CLOUD_URL,
    camerasJson: JSON.parse(process.env.CAMERAS_JSON || '[]'),
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseBucket: process.env.SUPABASE_BUCKET || 'camera-snapshots',
};
