import { 
  cards, type Card, type InsertCard, 
  users, type User, type InsertUser,
  profiles, type Profile, type InsertProfile,
  completions, type Completion, type InsertCompletion 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Card operations
  getAllCards(): Promise<Card[]>;
  getCardsByCategory(category: string): Promise<Card[]>;
  createCard(card: InsertCard): Promise<Card>;
  
  // User operations (required by existing code)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile operations
  getProfileByName(displayName: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  getAllProfiles(): Promise<Profile[]>;
  
  // Completion operations
  getCompletionsByProfile(profileId: number): Promise<Completion[]>;
  toggleCompletion(profileId: number, cardId: number): Promise<boolean>;
  isCardCompleted(profileId: number, cardId: number): Promise<boolean>;
  resetCompletions(profileId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllCards(): Promise<Card[]> {
    return await db.select().from(cards);
  }

  async getCardsByCategory(category: string): Promise<Card[]> {
    return await db.select().from(cards).where(eq(cards.category, category));
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db.insert(cards).values(insertCard).returning();
    return card;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Profile methods
  async getProfileByName(displayName: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.displayName, displayName));
    return profile || undefined;
  }
  
  async createProfile(profile: InsertProfile): Promise<Profile> {
    // Check if profile already exists
    const existingProfile = await this.getProfileByName(profile.displayName);
    if (existingProfile) {
      return existingProfile;
    }
    
    // Create new profile
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }
  
  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles);
  }
  
  // Completion methods
  async getCompletionsByProfile(profileId: number): Promise<Completion[]> {
    return await db.select().from(completions).where(eq(completions.profileId, profileId));
  }
  
  async isCardCompleted(profileId: number, cardId: number): Promise<boolean> {
    const [completion] = await db.select().from(completions).where(
      and(
        eq(completions.profileId, profileId),
        eq(completions.cardId, cardId)
      )
    );
    return !!completion;
  }
  
  async toggleCompletion(profileId: number, cardId: number): Promise<boolean> {
    // Check if completion already exists
    const isCompleted = await this.isCardCompleted(profileId, cardId);
    
    if (isCompleted) {
      // Remove completion
      await db.delete(completions).where(
        and(
          eq(completions.profileId, profileId),
          eq(completions.cardId, cardId)
        )
      );
      return false;
    } else {
      // Add completion
      await db.insert(completions).values({
        profileId,
        cardId
      });
      return true;
    }
  }
  
  async resetCompletions(profileId: number): Promise<void> {
    await db.delete(completions).where(eq(completions.profileId, profileId));
  }

  async initializeDefaultCards() {
    // Check if cards already exist
    const existingCards = await db.select().from(cards);
    
    // If cards exist, don't initialize
    if (existingCards.length > 0) {
      return;
    }
    
    const defaultCards: InsertCard[] = [
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

    // Insert all default cards to the database
    await db.insert(cards).values(defaultCards);
  }
}

// Create an instance of DatabaseStorage
const dbStorage = new DatabaseStorage();

// Initialize the default cards
dbStorage.initializeDefaultCards()
  .catch(error => console.error("Error initializing default cards:", error));

// Export the database storage instance
export const storage = dbStorage;
