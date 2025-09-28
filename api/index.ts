// Use CommonJS require/export for maximum compatibility with @vercel/node
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createApp } = require('../lib/app');

let app: any;
try {
	app = createApp();
	console.log('[vercel] serverless handler initialized');
} catch (e) {
	console.error('Failed to initialize app:', e);
	app = (req: any, res: any) => {
		res.statusCode = 500;
		res.setHeader('Content-Type', 'text/plain');
		res.end('App init error');
	};
}

module.exports = (req: any, res: any) => {
	try {
		return (app as any)(req, res);
	} catch (err) {
		console.error('Serverless handler error:', err);
		res.statusCode = 500;
		res.end('Internal Server Error');
	}
};
