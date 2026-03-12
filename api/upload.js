const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { filename, contentType, data, remoteUrl } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'Missing filename' });
    }

    let buffer;

    if (data) {
      // Base64-encoded data
      buffer = Buffer.from(data, 'base64');
    } else if (remoteUrl) {
      // Fetch remote image (e.g., stock art from Pixabay)
      const response = await fetch(remoteUrl);
      if (!response.ok) {
        return res.status(400).json({ error: `Failed to fetch remote URL: ${response.status}` });
      }
      const arrayBuf = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuf);
    } else {
      return res.status(400).json({ error: 'Missing data or remoteUrl' });
    }

    // Upload to Vercel Blob
    const blob = await put(`orders/${Date.now()}-${filename}`, buffer, {
      access: 'public',
      contentType: contentType || 'image/png',
    });

    return res.status(200).json({
      url: blob.url,
      filename: filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed', details: error.message });
  }
};
