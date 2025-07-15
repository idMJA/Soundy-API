import { Hono } from "hono";
import { getSpotifyToken } from "../../lib/spotify.js";

const app = new Hono();

app.get("/new-releases", async (c) => {
	try {
		const token = await getSpotifyToken();
		const response = await fetch(
			"https://api.spotify.com/v1/browse/new-releases",
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			const error = await response.json();
			// biome-ignore lint/suspicious/noExplicitAny: response.status type is dynamic from fetch API
			return c.json({ error }, response.status as any);
		}

		const data = await response.json();
		return c.json(data);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});

app.get("/featured", async (c) => {
	try {
		const token = await getSpotifyToken();
		const locale = c.req.query("locale");
		let url = "https://api.spotify.com/v1/browse/featured-playlists";
		if (locale) {
			url += `?locale=${encodeURIComponent(locale)}`;
		}
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const error = await response.json();
			// biome-ignore lint/suspicious/noExplicitAny: response.status type is dynamic from fetch API
			return c.json({ error }, response.status as any);
		}

		const data = await response.json();
		return c.json(data);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});

export default app;
