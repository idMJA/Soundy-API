const credentials: { clientId: string; clientSecret: string }[] = (() => {
	if (!process.env.SPOTIFY_CREDENTIALS) {
		throw new Error(
			"SPOTIFY_CREDENTIALS env is required and must be a JSON array",
		);
	}
	try {
		const parsed = JSON.parse(process.env.SPOTIFY_CREDENTIALS);
		if (Array.isArray(parsed)) {
			const filtered = parsed.filter((c) => c.clientId && c.clientSecret);
			if (filtered.length === 0) throw new Error();
			return filtered;
		}
		throw new Error();
	} catch {
		throw new Error(
			"SPOTIFY_CREDENTIALS env is not valid JSON array of credentials",
		);
	}
})();

let lastIndex = 0;
function getNextCredential() {
	if (credentials.length === 0)
		throw new Error("No Spotify credentials found in environment variables");
	const cred = credentials[lastIndex];
	lastIndex = (lastIndex + 1) % credentials.length;
	return cred;
}

export async function getSpotifyToken(): Promise<string> {
	const { clientId, clientSecret } = getNextCredential();
	const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			Authorization: `Basic ${basic}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: "grant_type=client_credentials",
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error_description || "Failed to get Spotify token");
	}

	const data = await response.json();
	return data.access_token;
}
