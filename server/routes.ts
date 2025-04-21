import { Express } from "express";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express) {
  app.get("/api/tasks", (req, res) => {
    const filePath = path.resolve(__dirname, "tasks.json");
    if (fs.existsSync(filePath)) {
      const tasks = JSON.parse(fs.readFileSync(filePath, "utf8"));
      res.json(tasks);
    } else {
      res.json([]);
    }
  });

  return {
    listen: app.listen.bind(app),
  };
}
