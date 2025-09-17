import { createApp } from '../lib/app';

const app = createApp();
const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
	console.log(`Local server running at http://localhost:${PORT}`);
});
