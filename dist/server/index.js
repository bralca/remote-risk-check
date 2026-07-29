const { createReadStream, existsSync, statSync } = require("node:fs");
const { createServer } = require("node:http");
const { extname, join, normalize } = require("node:path");

const port = Number(process.env.PORT || 3000);
const publicRoot = join(__dirname, "..");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".xml": "application/xml; charset=utf-8"
};

function resolvePublicFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
  const candidates = [
    relative === "/" ? "index.html" : relative.replace(/^[/\\]/, ""),
    `${relative.replace(/^[/\\]/, "").replace(/\/$/, "")}.html`,
    join(relative.replace(/^[/\\]/, ""), "index.html")
  ];

  for (const candidate of candidates) {
    const absolute = join(publicRoot, candidate);
    if (
      absolute.startsWith(publicRoot) &&
      existsSync(absolute) &&
      statSync(absolute).isFile()
    ) {
      return absolute;
    }
  }

  return null;
}

function sendFile(request, response, filePath) {
  const stat = statSync(filePath);
  const contentType =
    contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
  const range = request.headers.range;

  response.setHeader("Content-Type", contentType);
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader(
    "Cache-Control",
    filePath.includes(`${join("_next", "static")}`)
      ? "public, max-age=31536000, immutable"
      : "public, max-age=300"
  );

  if (range && contentType.startsWith("video/")) {
    const [startText, endText] = range.replace("bytes=", "").split("-");
    const start = Number(startText);
    const end = endText ? Number(endText) : stat.size - 1;

    if (
      Number.isInteger(start) &&
      Number.isInteger(end) &&
      start >= 0 &&
      end >= start &&
      end < stat.size
    ) {
      response.writeHead(206, {
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`
      });
      createReadStream(filePath, { start, end }).pipe(response);
      return;
    }
  }

  response.setHeader("Content-Length", stat.size);
  response.writeHead(200);
  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", "http://localhost");
  const filePath = resolvePublicFile(url.pathname);

  if (!filePath) {
    const notFound = join(publicRoot, "404.html");
    response.statusCode = 404;
    sendFile(request, response, notFound);
    return;
  }

  sendFile(request, response, filePath);
});

server.listen(port, "0.0.0.0", () => {
  process.stdout.write(`Remote Risk Check listening on ${port}\n`);
});
