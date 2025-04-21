import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertCompletionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get all cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getAllCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  // API endpoint to get cards by category
  app.get("/api/cards/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const cards = await storage.getCardsByCategory(category);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards by category" });
    }
  });

  // Profile routes
  // Create or get profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Get all profiles
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Get profile by name
  app.get("/api/profiles/:name", async (req, res) => {
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

  // Completion routes
  // Get completions by profile
  app.get("/api/profiles/:profileId/completions", async (req, res) => {
    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      const completions = await storage.getCompletionsByProfile(profileId);
      res.json(completions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });

  // Toggle completion status
  app.post("/api/completions/toggle", async (req, res) => {
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

  // Check if card is completed
  app.get("/api/completions/check", async (req, res) => {
    try {
      const profileId = parseInt(req.query.profileId as string);
      const cardId = parseInt(req.query.cardId as string);
      
      if (isNaN(profileId) || isNaN(cardId)) {
        return res.status(400).json({ message: "Invalid profile ID or card ID" });
      }
      
      const isCompleted = await storage.isCardCompleted(profileId, cardId);
      res.json({ isCompleted });
    } catch (error) {
      res.status(500).json({ message: "Failed to check completion status" });
    }
  });

  // Reset all completions for a profile
  app.post("/api/profiles/:profileId/reset", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
