// Diagnostic endpoint to verify Vercel Blob is configured
const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  const tokenPrefix = hasToken
    ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 12) + '...'
    : 'NOT SET';

  // Try a tiny test upload
  let uploadResult = null;
  if (hasToken) {
    try {
      const testBuffer = Buffer.from('test', 'utf-8');
      const blob = await put(`_test/ping-${Date.now()}.txt`, testBuffer, {
        access: 'public',
        contentType: 'text/plain',
      });
      uploadResult = { success: true, url: blob.url };
    } catch (e) {
      uploadResult = { success: false, error: e.message };
    }
  }

  return res.status(200).json({
    blobTokenSet: hasToken,
    tokenPrefix,
    uploadResult,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  });
};
