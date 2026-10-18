const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { graphql } = require("graphql");
const { schema, schemaSDL } = require("./server/schema");
const { getSnapshot, resetStore } = require("./server/data");
const { createRootResolvers } = require("./server/resolvers");

const publicRoot = path.join(__dirname, "public");

function loadLocalEnv() {
  const envFile = path.join(__dirname, ".env");
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!Object.hasOwn(process.env, key)) process.env[key] = value;
  }
}
loadLocalEnv();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

  if (req.method === "GET" && urlPath === "/api/state") {
    return sendJson(res, 200, {
      ok: true,
      state: getSnapshot(),
      schemaSDL,
    });
  }

  if (req.method === "GET" && urlPath === "/api/firebase-config") {
    const config = {
      apiKey: process.env.FIREBASE_API_KEY || "",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.FIREBASE_APP_ID || "",
    };
    const configured = Object.values(config).every(Boolean);
    res.setHeader("cache-control", "no-store");
    return sendJson(res, 200, { configured, config: configured ? config : null });
  }

  if (req.method === "POST" && urlPath === "/api/reset") {
    const state = resetStore();
    return sendJson(res, 200, {
      ok: true,
      message: "Library data reset to starter state.",
      state,
    });
  }

  if (req.method === "POST" && urlPath === "/graphql") {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    try {
      const { query, variables } = JSON.parse(raw || "{}");
      const trace = [];
      const startedAt = performance.now();
      const result = await graphql({
        schema,
        source: query || "",
        rootValue: createRootResolvers(trace),
        contextValue: { trace },
        variableValues: variables || {},
      });
      const durationMs = Number((performance.now() - startedAt).toFixed(2));
      return sendJson(res, 200, {
        ...result,
        extensions: {
          durationMs,
          trace,
          state: getSnapshot(),
        },
      });
    } catch (error) {
      return sendJson(res, 400, {
        errors: [{ message: error.message }],
      });
    }
  }

  let requested = urlPath;
  if (requested === "/") requested = "/index.html";
  if (requested.endsWith("/")) requested += "index.html";
  const file = path.resolve(publicRoot, `.${requested}`);
  if (
    !file.startsWith(`${publicRoot}${path.sep}`) &&
    file !== path.join(publicRoot, "index.html")
  ) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(file, (error, contents) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, {
      "content-type":
        mimeTypes[path.extname(file)] || "application/octet-stream",
    });
    res.end(contents);
  });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  server.listen(port, () =>
    console.log(`Learning Studio: http://localhost:${port}`),
  );
}

module.exports = { server };
