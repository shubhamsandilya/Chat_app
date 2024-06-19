const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://chat-app-backend-qmli.onrender.com",
      changeOrigin: true,
    })
  );
};
