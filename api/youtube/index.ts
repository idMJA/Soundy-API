import { Hono } from "hono";
import YTMusic from "ytmusic-api";

const app = new Hono();

app.get("/trending", async (c) => {
	const ytmusic = new YTMusic();
	try {
		await ytmusic.initialize();
		const charts = await ytmusic.getHomeSections();
		return c.json(charts);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});

export default app;
