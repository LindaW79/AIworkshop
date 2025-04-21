import { pgTable, text, serial, integer, jsonb, boolean, foreignKey, primaryKey, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define card difficulty enum
export const CardDifficulty = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

// Define card category enum
export const CardCategory = {
  TEXT: "text",
  CODING: "coding",
  IMAGE: "image",
  MUSIC: "music",
  VIDEO: "video",
} as const;

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
});

export const insertCardSchema = createInsertSchema(cards).pick({
  title: true,
  description: true,
  category: true,
  difficulty: true,
});

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;

// For frontend usage, extend the base Card type
export const cardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum([
    CardCategory.TEXT,
    CardCategory.CODING,
    CardCategory.IMAGE,
    CardCategory.MUSIC,
    CardCategory.VIDEO,
  ]),
  difficulty: z.enum([
    CardDifficulty.EASY,
    CardDifficulty.MEDIUM,
    CardDifficulty.HARD,
  ]),
});

export type CardType = z.infer<typeof cardSchema>;

// Define the users table (required by the existing code)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the profiles table for storing user display names
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  displayName: text("display_name").notNull().unique(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  displayName: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

// Define the completions table for tracking completed cards by profile
export const completions = pgTable("completions", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id),
  cardId: integer("card_id").notNull().references(() => cards.id),
}, (table) => {
  return {
    profileCardUnique: unique().on(table.profileId, table.cardId),
  };
});

export const insertCompletionSchema = createInsertSchema(completions).pick({
  profileId: true,
  cardId: true,
});

export type InsertCompletion = z.infer<typeof insertCompletionSchema>;
export type Completion = typeof completions.$inferSelect;
