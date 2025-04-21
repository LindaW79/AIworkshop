// Define card difficulty enum
export enum CardDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

// Define card category enum
export enum CardCategory {
  TEXT = "text",
  CODING = "coding",
  IMAGE = "image",
  MUSIC = "music",
  VIDEO = "video",
}

// Card interface
export interface CardType {
  id: string;
  title: string;
  description: string;
  category: CardCategory;
  difficulty: CardDifficulty;
}

// DrawnCards type to track which cards have been drawn from each deck
export type DrawnCards = Record<CardCategory, string[]>;

// CompletedCards type to track which cards have been marked as completed
export type CompletedCards = string[];

// ViewMode type for switching between single and all cards view
export type ViewMode = "single" | "all";
