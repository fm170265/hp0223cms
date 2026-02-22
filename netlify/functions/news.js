// netlify/functions/news.js
exports.handler = async (event) => {
  try {
    const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
    const API_KEY = process.env.MICROCMS_API_KEY;

    const limitRaw = event.queryStringParameters?.limit;
    const limit = Math.min(Number(limitRaw ?? 2) || 2, 10);

    if (!SERVICE_DOMAIN || !API_KEY) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [],
          error: "Missing env vars: MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY",
        }),
      };
    }

    const url =
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/news` +
      `?filters=isActive[equals]true&orders=-publishedAt&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        "X-MICROCMS-API-KEY": API_KEY,
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        statusCode: res.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [],
          error: "microCMS request failed",
          detail: text.slice(0, 300),
        }),
      };
    }

    const json = await res.json();
    const items = Array.isArray(json.contents) ? json.contents : [];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // 軽いキャッシュ（不要なら消してOK）
        "Cache-Control": "public, max-age=60",
      },
      body: JSON.stringify({ items }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [], error: String(e) }),
    };
  }
};