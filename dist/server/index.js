function assetRequest(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
}

async function fetchAsset(request, env) {
  if (!env.ASSETS || typeof env.ASSETS.fetch !== "function") {
    return new Response("Static asset binding is unavailable.", { status: 503 });
  }

  const url = new URL(request.url);
  const original = await env.ASSETS.fetch(request);

  if (
    original.status !== 404 ||
    url.pathname === "/" ||
    /\.[a-z0-9]+$/i.test(url.pathname)
  ) {
    return original;
  }

  const htmlPath = `${url.pathname.replace(/\/$/, "")}.html`;
  return env.ASSETS.fetch(assetRequest(request, htmlPath));
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "SAMEORIGIN");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env) {
    const response = await fetchAsset(request, env);
    return withSecurityHeaders(response);
  }
};
