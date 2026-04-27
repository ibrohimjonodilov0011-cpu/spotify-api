export default async function handler(req, res) {
  try {
    const q = req.query.q || "";
    if (q.length < 2) {
      return res.status(200).json([]);
    }

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    if (!client_id || !client_secret) {
      return res.status(500).json({ error: "no env", client_id, client_secret });
    }

    // 👇 важно: base64
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + basic,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    // 👇 если токен не пришёл — покажем ответ Spotify
    if (!tokenData.access_token) {
      return res.status(500).json({
        error: "no token",
        spotify_response: tokenData,
      });
    }

    const token = tokenData.access_token;

    const searchRes = await fetch(
      https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await searchRes.json();

    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({
      error: "server crash",
      message: e.message,
      stack: e.stack,
    });
  }
}
