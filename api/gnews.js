// Vercel serverless function to proxy GNews requests and handle CORS
export default async function handler(req, res) {
  const { method, query } = req;

  // Allow only GET
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // CORS headers (allow any origin for demo; tighten in real apps)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing GNEWS_API_KEY env var on server' });
  }

  const { q, category = 'general', page = '1', max = '10', lang = 'en', type = 'top' } = query;

  // Build target URL
  let url;
  if (q && q !== 'latest') {
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&apikey=${apiKey}&page=${page}&max=${max}&lang=${lang}`;
  } else {
    url = `https://gnews.io/api/v4/top-headlines?category=${encodeURIComponent(category)}&apikey=${apiKey}&page=${page}&max=${max}&lang=${lang}`;
  }

  try {
    const upstream = await fetch(url);
    const text = await upstream.text();

    if (!upstream.ok) {
      return res.status(upstream.status).send(text);
    }

    // Pass-through JSON
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(502).json({ message: 'Upstream fetch failed', error: String(err) });
  }
}


