module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const { prompt, style } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const base = prompt.trim();
    const fullPrompt = (style ? `${style} ${base}` : base) +
      ', isolated on a plain solid white background, suitable for printing on apparel, no border or frame';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: fullPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '3:4',
            personGeneration: 'allow_all',
            imageSize: '2K',
            outputOptions: { mimeType: 'image/png' },
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Imagen API error:', response.status, errBody);
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limited — please wait a moment and try again' });
      }
      return res.status(502).json({ error: 'Image generation failed', details: errBody });
    }

    const data = await response.json();
    const predictions = data.predictions;

    if (!predictions || !predictions.length || !predictions[0].bytesBase64Encoded) {
      return res.status(400).json({
        error: 'No image generated',
        details: 'The prompt may have been blocked by safety filters',
      });
    }

    return res.status(200).json({
      image: predictions[0].bytesBase64Encoded,
      mimeType: 'image/png',
    });
  } catch (error) {
    console.error('Generate image error:', error);
    return res.status(500).json({ error: 'Image generation failed', details: error.message });
  }
};
