module.exports = async (req, res) => {
  const SITE_URL = process.env.SITE_URL || `https://${req.headers.host || 'localhost'}`;
  const urls = ['/', '/projects'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${SITE_URL}${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}\n</urlset>`;
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(body);
};
