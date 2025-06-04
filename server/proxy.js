const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy middleware configuration
const proxyOptions = {
  target: "https://api.main.atgraphite.com",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "/api", // rewrite path
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  },
};

// Use the proxy for /api routes
app.use("/api", createProxyMiddleware(proxyOptions));

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
