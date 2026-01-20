const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseKey, supabaseBucket } = require('../config');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload snapshot to Supabase bucket and save record to database
 * @param {string} filePath - Local path to the snapshot file
 * @param {string} cameraId - UUID of the camera
 * @param {string} cameraName - Name of the camera (for file naming)
 * @returns {Promise<{url: string, record: object} | null>}
 */
async function uploadToSupabase(filePath, cameraId, cameraName) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const storagePath = `${cameraName}/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(supabaseBucket)
            .upload(storagePath, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (uploadError) {
            console.error(`Error uploading to Supabase Storage: ${uploadError.message}`);
            return null;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(supabaseBucket)
            .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        // Insert record into camera_snaps table
        const { data: dbRecord, error: dbError } = await supabase
            .from('camera_snaps')
            .insert({
                camera_id: cameraId,
                url: publicUrl,
            })
            .select()
            .single();

        if (dbError) {
            console.error(`Error inserting into camera_snaps: ${dbError.message}`);
            return null;
        }

        console.log(`Snapshot uploaded and saved to database: ${publicUrl}`);

        // Delete local file after successful upload
        fs.unlinkSync(filePath);

        return { url: publicUrl, record: dbRecord };
    } catch (error) {
        console.error(`Error in uploadToSupabase: ${error.message}`);
        return null;
    }
}

/**
 * Capture snapshot from RTSP stream and upload to Supabase
 * @param {string} cameraId - UUID of the camera
 * @param {string} cameraName - Name of the camera
 * @param {string} rtspUrl - RTSP URL of the camera stream
 * @returns {Promise<{url: string, record: object} | null>}
 */
function captureSnapshot(cameraId, cameraName, rtspUrl) {
    return new Promise((resolve) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const snapshotDir = path.join(__dirname, '..', 'snapshots');

        if (!fs.existsSync(snapshotDir)) {
            fs.mkdirSync(snapshotDir, { recursive: true });
        }

        const snapshotPath = path.join(snapshotDir, `${cameraName}_${timestamp}.jpg`);

        const ffmpegCommand = `ffmpeg -y -rtsp_transport tcp -i ${rtspUrl} -frames:v 1 -q:v 2 ${snapshotPath}`;

        exec(ffmpegCommand, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error capturing snapshot for ${cameraName}: ${error.message}`);
                resolve(null);
                return;
            }

            console.log(`Snapshot captured for ${cameraName} at ${snapshotPath}`);

            // Upload to Supabase and save to database
            const result = await uploadToSupabase(snapshotPath, cameraId, cameraName);
            resolve(result);
        });
    });
}

module.exports = { captureSnapshot, uploadToSupabase };