import express from "express";
import { serveStatic, log } from "./vite.js";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json());

(async () => {
  const server = await registerRoutes(app);

  serveStatic(app);

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

