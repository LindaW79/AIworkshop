import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export function serveStatic(app: express.Express) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientPath = path.resolve(__dirname, "../docs");

  if (!fs.existsSync(clientPath)) {
    console.warn("Static client path does not exist:", clientPath);
    return;
  }

  app.use("/", express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientPath, "index.html"));
  });
}

export function log(message: string) {
  console.log(`[AIWorkshop] ${message}`);
}

