const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://internalapi.biip.lt/hidro/api",
      changeOrigin: true,
      pathRewrite: {
        "^/api": ""
      },
      headers: {
        Connection: "keep-alive"
      }
    })
  );
};
