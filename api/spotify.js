export default async function handler(req, res) {

    const q = req.query.q;

    if (!q || q.length < 2) {
        return res.status(200).json([]);
    }

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
        return res.status(500).json({ error: "no token" });
    }

    const searchRes = await fetch(
        https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10&market=US,
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    const data = await searchRes.json();

    const items = data.tracks?.items || [];

    const out = items.map(t => ({
        id: t.id,
        title: t.name,
        artist: t.artists?.[0]?.name || "",
        cover: t.album?.images?.[0]?.url || "",
        url: t.external_urls?.spotify || ""
    }));

    res.status(200).json(out);
}
