var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  CardCategory: () => CardCategory,
  CardDifficulty: () => CardDifficulty,
  cardSchema: () => cardSchema,
  cards: () => cards,
  completions: () => completions,
  insertCardSchema: () => insertCardSchema,
  insertCompletionSchema: () => insertCompletionSchema,
  insertProfileSchema: () => insertProfileSchema,
  insertUserSchema: () => insertUserSchema,
  profiles: () => profiles,
  users: () => users
});
import { pgTable, text, serial, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var CardDifficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
};
var CardCategory = {
  TEXT: "text",
  CODING: "coding",
  IMAGE: "image",
  MUSIC: "music",
  VIDEO: "video"
};
var cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull()
});
var insertCardSchema = createInsertSchema(cards).pick({
  title: true,
  description: true,
  category: true,
  difficulty: true
});
var cardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum([
    CardCategory.TEXT,
    CardCategory.CODING,
    CardCategory.IMAGE,
    CardCategory.MUSIC,
    CardCategory.VIDEO
  ]),
  difficulty: z.enum([
    CardDifficulty.EASY,
    CardDifficulty.MEDIUM,
    CardDifficulty.HARD
  ])
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  displayName: text("display_name").notNull().unique(),
  createdAt: text("created_at").notNull().default((/* @__PURE__ */ new Date()).toISOString())
});
var insertProfileSchema = createInsertSchema(profiles).pick({
  displayName: true
});
var completions = pgTable("completions", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id),
  cardId: integer("card_id").notNull().references(() => cards.id)
}, (table) => {
  return {
    profileCardUnique: unique().on(table.profileId, table.cardId)
  };
});
var insertCompletionSchema = createInsertSchema(completions).pick({
  profileId: true,
  cardId: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and } from "drizzle-orm";
var DatabaseStorage = class {
  async getAllCards() {
    return await db.select().from(cards);
  }
  async getCardsByCategory(category) {
    return await db.select().from(cards).where(eq(cards.category, category));
  }
  async createCard(insertCard) {
    const [card] = await db.insert(cards).values(insertCard).returning();
    return card;
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Profile methods
  async getProfileByName(displayName) {
    const [profile] = await db.select().from(profiles).where(eq(profiles.displayName, displayName));
    return profile || void 0;
  }
  async createProfile(profile) {
    const existingProfile = await this.getProfileByName(profile.displayName);
    if (existingProfile) {
      return existingProfile;
    }
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }
  async getAllProfiles() {
    return await db.select().from(profiles);
  }
  // Completion methods
  async getCompletionsByProfile(profileId) {
    return await db.select().from(completions).where(eq(completions.profileId, profileId));
  }
  async isCardCompleted(profileId, cardId) {
    const [completion] = await db.select().from(completions).where(
      and(
        eq(completions.profileId, profileId),
        eq(completions.cardId, cardId)
      )
    );
    return !!completion;
  }
  async toggleCompletion(profileId, cardId) {
    const isCompleted = await this.isCardCompleted(profileId, cardId);
    if (isCompleted) {
      await db.delete(completions).where(
        and(
          eq(completions.profileId, profileId),
          eq(completions.cardId, cardId)
        )
      );
      return false;
    } else {
      await db.insert(completions).values({
        profileId,
        cardId
      });
      return true;
    }
  }
  async resetCompletions(profileId) {
    await db.delete(completions).where(eq(completions.profileId, profileId));
  }
  async initializeDefaultCards() {
    const existingCards = await db.select().from(cards);
    if (existingCards.length > 0) {
      return;
    }
    const defaultCards = [
      // Text category
      { title: "Create a Haiku", description: "Use an AI tool to help you create a haiku about technology.", category: "text", difficulty: "easy" },
      { title: "Summarize an Article", description: "Find a long article and use AI to create a concise summary of the key points.", category: "text", difficulty: "medium" },
      { title: "Write a Short Story", description: "Collaborate with AI to write a 500-word short story in the sci-fi genre.", category: "text", difficulty: "medium" },
      { title: "Text Translation", description: "Translate a paragraph of text from English to three different languages and back to English. Compare the result to the original.", category: "text", difficulty: "easy" },
      { title: "Create a Poem Generator", description: "Prompt an AI to create a poem generator that can produce poems in specific styles based on user input topics.", category: "text", difficulty: "hard" },
      { title: "AI Writing Assistant", description: "Create a detailed prompt to help an AI generate a complex academic paper with proper citations and research.", category: "text", difficulty: "hard" },
      // Coding category
      { title: "Debug This Code", description: "Find and fix the bugs in a provided code snippet with the help of AI.", category: "coding", difficulty: "medium" },
      { title: "Optimize an Algorithm", description: "Take a simple sorting algorithm and use AI to help you optimize it for better performance.", category: "coding", difficulty: "hard" },
      { title: "Convert to Another Language", description: "Convert a JavaScript function to Python using AI assistance.", category: "coding", difficulty: "medium" },
      { title: "Create a Simple Game", description: "Use AI to help you create a simple text-based game in your preferred programming language.", category: "coding", difficulty: "hard" },
      { title: "Generate Unit Tests", description: "Ask an AI to create unit tests for a given function.", category: "coding", difficulty: "easy" },
      { title: "Create Documentation", description: "Use AI to help you generate comprehensive documentation for a piece of code you provide.", category: "coding", difficulty: "easy" },
      // Image category
      { title: "Generate a Landscape", description: "Use an image generation AI to create a landscape scene based on a written description.", category: "image", difficulty: "easy" },
      { title: "Image Variation", description: "Take an existing image and use AI to create several variations with different styles.", category: "image", difficulty: "medium" },
      { title: "Image Restoration", description: "Find an old, damaged photo and use AI to restore it.", category: "image", difficulty: "medium" },
      { title: "Create an Avatar", description: "Use AI to generate a personalized avatar based on a text description of yourself.", category: "image", difficulty: "easy" },
      { title: "Style Transfer", description: "Apply the artistic style of a famous painting to a photograph using AI tools.", category: "image", difficulty: "hard" },
      { title: "Generate Complex Scene", description: "Create a detailed prompt to generate a complex image with multiple subjects, specific lighting and atmosphere.", category: "image", difficulty: "hard" },
      // Music category
      { title: "Generate a Melody", description: "Use AI to create a short melody based on a mood description.", category: "music", difficulty: "easy" },
      { title: "Complete a Song", description: "Start composing a simple tune and ask AI to complete it.", category: "music", difficulty: "medium" },
      { title: "Genre Transformation", description: "Take a known song and use AI to transform it into a different music genre.", category: "music", difficulty: "hard" },
      { title: "Create Lyrics", description: "Use AI to generate lyrics for a song on a specific theme or topic.", category: "music", difficulty: "medium" },
      { title: "Sound Effects", description: "Generate various sound effects using AI for a specific scenario (e.g., a rainforest).", category: "music", difficulty: "easy" },
      { title: "Create Full Composition", description: "Use AI to generate a complete musical composition with multiple instruments and sections.", category: "music", difficulty: "hard" },
      // Video category
      { title: "Caption Generation", description: "Upload a short video clip and use AI to generate accurate captions.", category: "video", difficulty: "easy" },
      { title: "Video Enhancement", description: "Take a low-resolution video and use AI to enhance its quality.", category: "video", difficulty: "medium" },
      { title: "Create an Animation", description: "Use AI tools to create a simple animated sequence based on text prompts.", category: "video", difficulty: "hard" },
      { title: "Video Summarization", description: "Find a 10+ minute video and use AI to create a concise summary of its content.", category: "video", difficulty: "medium" },
      { title: "Style Transfer for Video", description: "Apply artistic style transfer to a short video clip.", category: "video", difficulty: "hard" },
      { title: "AI Video Script", description: "Use AI to generate a compelling script for a short instructional or promotional video.", category: "video", difficulty: "easy" }
    ];
    await db.insert(cards).values(defaultCards);
  }
};
var dbStorage = new DatabaseStorage();
dbStorage.initializeDefaultCards().catch((error) => console.error("Error initializing default cards:", error));
var storage = dbStorage;

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/cards", async (req, res) => {
    try {
      const cards2 = await storage.getAllCards();
      res.json(cards2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });
  app2.get("/api/cards/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const cards2 = await storage.getCardsByCategory(category);
      res.json(cards2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards by category" });
    }
  });
  app2.post("/api/profiles", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });
  app2.get("/api/profiles", async (req, res) => {
    try {
      const profiles2 = await storage.getAllProfiles();
      res.json(profiles2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });
  app2.get("/api/profiles/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const profile = await storage.getProfileByName(name);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app2.get("/api/profiles/:profileId/completions", async (req, res) => {
    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      const completions2 = await storage.getCompletionsByProfile(profileId);
      res.json(completions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });
  app2.post("/api/completions/toggle", async (req, res) => {
    try {
      const { profileId, cardId } = req.body;
      if (!profileId || !cardId) {
        return res.status(400).json({ message: "Profile ID and Card ID are required" });
      }
      const isCompleted = await storage.toggleCompletion(profileId, cardId);
      res.json({ isCompleted });
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle completion status" });
    }
  });
  app2.get("/api/completions/check", async (req, res) => {
    try {
      const profileId = parseInt(req.query.profileId);
      const cardId = parseInt(req.query.cardId);
      if (isNaN(profileId) || isNaN(cardId)) {
        return res.status(400).json({ message: "Invalid profile ID or card ID" });
      }
      const isCompleted = await storage.isCardCompleted(profileId, cardId);
      res.json({ isCompleted });
    } catch (error) {
      res.status(500).json({ message: "Failed to check completion status" });
    }
  });
  app2.post("/api/profiles/:profileId/reset", async (req, res) => {
    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      await storage.resetCompletions(profileId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset completions" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
