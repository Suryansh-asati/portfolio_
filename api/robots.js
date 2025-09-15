module.exports = async (req, res) => {
  const SITE_URL = process.env.SITE_URL || `https://${req.headers.host || 'localhost'}`;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(body);
};
