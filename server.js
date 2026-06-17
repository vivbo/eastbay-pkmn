/*
 * server.js — a tiny local web server, only used for previewing the site.
 * You do NOT need this to use the site (you can just double-click index.html).
 * It exists so the page can be viewed at http://localhost:8127 during testing.
 *
 * Run it with:  node server.js
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname; // serve files from this folder
const PORT = 8127;

// Map file extensions to the content type browsers expect.
const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".csv": "text/csv",
};

http
  .createServer((req, res) => {
    // Default "/" to index.html; strip any query string.
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    const filePath = path.join(ROOT, urlPath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": TYPES[ext] || "text/plain" });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`Serving on http://localhost:${PORT}`));
