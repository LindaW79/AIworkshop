import express from "express";

export function serveStatic(_app: express.Express) {
  // No-op: frontend is served via GitHub Pages
}

export function log(message: string) {
  console.log(`[AIWorkshop] ${message}`);
}
