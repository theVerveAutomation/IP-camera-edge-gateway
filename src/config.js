require('dotenv').config();
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    cloudUrl: process.env.CLOUD_URL,
    camerasJson: JSON.parse(process.env.CAMERAS_JSON || '[]'),
};
