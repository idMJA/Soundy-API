import { Hono } from "hono";
import { handle } from "hono/vercel";
import spotify from "./spotify/index.js";
import youtube from "./youtube/index.js";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
	return c.json({ message: "Congrats! You've deployed Hono to Vercel" });
});

// Mount the Spotify API under /spotify
app.route("/spotify", spotify);
app.route("/youtube", youtube);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
