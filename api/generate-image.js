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

    const fullPrompt = style ? `${style} ${prompt.trim()}` : prompt.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseModalities: ['IMAGE'],
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API error:', response.status, errBody);
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limited — please wait a moment and try again' });
      }
      return res.status(502).json({ error: 'Image generation failed', details: errBody });
    }

    const data = await response.json();

    // Extract inline image from response
    const parts = data.candidates?.[0]?.content?.parts;
    if (!parts) {
      return res.status(502).json({ error: 'No content returned from Gemini' });
    }

    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart) {
      // Might have been blocked by safety filters
      const textPart = parts.find(p => p.text);
      return res.status(400).json({
        error: 'No image generated',
        details: textPart?.text || 'The prompt may have been blocked by safety filters',
      });
    }

    return res.status(200).json({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    });
  } catch (error) {
    console.error('Generate image error:', error);
    return res.status(500).json({ error: 'Image generation failed', details: error.message });
  }
};
