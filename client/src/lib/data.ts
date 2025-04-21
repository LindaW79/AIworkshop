import { CardType, CardCategory, CardDifficulty } from "./types";

// Default cards data
export const defaultCards: CardType[] = [
  // Text category
  { 
    id: "t1", 
    title: "Create a Haiku", 
    description: "Use an AI tool to help you create a haiku about technology.", 
    category: CardCategory.TEXT, 
    difficulty: CardDifficulty.EASY 
  },
  { 
    id: "t2", 
    title: "Summarize an Article", 
    description: "Find a long article and use AI to create a concise summary of the key points.", 
    category: CardCategory.TEXT, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "t3", 
    title: "Write a Short Story", 
    description: "Collaborate with AI to write a 500-word short story in the sci-fi genre.", 
    category: CardCategory.TEXT, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "t4", 
    title: "Text Translation", 
    description: "Translate a paragraph of text from English to three different languages and back to English. Compare the result to the original.", 
    category: CardCategory.TEXT, 
    difficulty: CardDifficulty.EASY 
  },
  { 
    id: "t5", 
    title: "Create a Poem Generator", 
    description: "Prompt an AI to create a poem generator that can produce poems in specific styles based on user input topics.", 
    category: CardCategory.TEXT, 
    difficulty: CardDifficulty.HARD 
  },
  { 
    id: "t6", 
    title: "AI Writing Assistant", 
    description: "Create a detailed prompt to help an AI generate a complex academic paper with proper citations and research.", 
    category: CardCategory.TEXT, 
    difficulty: CardDifficulty.HARD 
  },
  
  // Coding category
  { 
    id: "c1", 
    title: "Debug This Code", 
    description: "Find and fix the bugs in a provided code snippet with the help of AI.", 
    category: CardCategory.CODING, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "c2", 
    title: "Optimize an Algorithm", 
    description: "Take a simple sorting algorithm and use AI to help you optimize it for better performance.", 
    category: CardCategory.CODING, 
    difficulty: CardDifficulty.HARD 
  },
  { 
    id: "c3", 
    title: "Convert to Another Language", 
    description: "Convert a JavaScript function to Python using AI assistance.", 
    category: CardCategory.CODING, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "c4", 
    title: "Create a Simple Game", 
    description: "Use AI to help you create a simple text-based game in your preferred programming language.", 
    category: CardCategory.CODING, 
    difficulty: CardDifficulty.HARD 
  },
  { 
    id: "c5", 
    title: "Generate Unit Tests", 
    description: "Ask an AI to create unit tests for a given function.", 
    category: CardCategory.CODING, 
    difficulty: CardDifficulty.EASY 
  },
  { 
    id: "c6", 
    title: "Create Documentation", 
    description: "Use AI to help you generate comprehensive documentation for a piece of code you provide.", 
    category: CardCategory.CODING, 
    difficulty: CardDifficulty.EASY 
  },
  
  // Image category
  { 
    id: "i1", 
    title: "Generate a Landscape", 
    description: "Use an image generation AI to create a landscape scene based on a written description.", 
    category: CardCategory.IMAGE, 
    difficulty: CardDifficulty.EASY 
  },
  { 
    id: "i2", 
    title: "Image Variation", 
    description: "Take an existing image and use AI to create several variations with different styles.", 
    category: CardCategory.IMAGE, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "i3", 
    title: "Image Restoration", 
    description: "Find an old, damaged photo and use AI to restore it.", 
    category: CardCategory.IMAGE, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "i4", 
    title: "Create an Avatar", 
    description: "Use AI to generate a personalized avatar based on a text description of yourself.", 
    category: CardCategory.IMAGE, 
    difficulty: CardDifficulty.EASY 
  },
  { 
    id: "i5", 
    title: "Style Transfer", 
    description: "Apply the artistic style of a famous painting to a photograph using AI tools.", 
    category: CardCategory.IMAGE, 
    difficulty: CardDifficulty.HARD 
  },
  { 
    id: "i6", 
    title: "Generate Complex Scene", 
    description: "Create a detailed prompt to generate a complex image with multiple subjects, specific lighting and atmosphere.", 
    category: CardCategory.IMAGE, 
    difficulty: CardDifficulty.HARD 
  },
  
  // Music category
  { 
    id: "m1", 
    title: "Generate a Melody", 
    description: "Use AI to create a short melody based on a mood description.", 
    category: CardCategory.MUSIC, 
    difficulty: CardDifficulty.EASY 
  },
  { 
    id: "m2", 
    title: "Complete a Song", 
    description: "Start composing a simple tune and ask AI to complete it.", 
    category: CardCategory.MUSIC, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "m3", 
    title: "Genre Transformation", 
    description: "Take a known song and use AI to transform it into a different music genre.", 
    category: CardCategory.MUSIC, 
    difficulty: CardDifficulty.HARD 
  },
  { 
    id: "m4", 
    title: "Create Lyrics", 
    description: "Use AI to generate lyrics for a song on a specific theme or topic.", 
    category: CardCategory.MUSIC, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "m5", 
    title: "Sound Effects", 
    description: "Generate various sound effects using AI for a specific scenario (e.g., a rainforest).", 
    category: CardCategory.MUSIC, 
    difficulty: CardDifficulty.EASY 
  },
  { 
    id: "m6", 
    title: "Create Full Composition", 
    description: "Use AI to generate a complete musical composition with multiple instruments and sections.", 
    category: CardCategory.MUSIC, 
    difficulty: CardDifficulty.HARD 
  },
  
  // Video category
  { 
    id: "v1", 
    title: "Caption Generation", 
    description: "Upload a short video clip and use AI to generate accurate captions.", 
    category: CardCategory.VIDEO, 
    difficulty: CardDifficulty.EASY 
  },
  { 
    id: "v2", 
    title: "Video Enhancement", 
    description: "Take a low-resolution video and use AI to enhance its quality.", 
    category: CardCategory.VIDEO, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "v3", 
    title: "Create an Animation", 
    description: "Use AI tools to create a simple animated sequence based on text prompts.", 
    category: CardCategory.VIDEO, 
    difficulty: CardDifficulty.HARD 
  },
  { 
    id: "v4", 
    title: "Video Summarization", 
    description: "Find a 10+ minute video and use AI to create a concise summary of its content.", 
    category: CardCategory.VIDEO, 
    difficulty: CardDifficulty.MEDIUM 
  },
  { 
    id: "v5", 
    title: "Style Transfer for Video", 
    description: "Apply artistic style transfer to a short video clip.", 
    category: CardCategory.VIDEO, 
    difficulty: CardDifficulty.HARD 
  },
  { 
    id: "v6", 
    title: "AI Video Script", 
    description: "Use AI to generate a compelling script for a short instructional or promotional video.", 
    category: CardCategory.VIDEO, 
    difficulty: CardDifficulty.EASY 
  }
];

// Helper function to get cards by category
export function getCardsByCategory(cards: CardType[], category: string): CardType[] {
  return cards.filter(card => card.category === category);
}

// Category metadata
export const categoryMetadata = {
  [CardCategory.TEXT]: {
    title: "Text",
    color: "text-blue-500 bg-blue-100",
    iconPath: "M4 6h16M4 12h16M4 18h7",
    bgColor: "bg-category-text",
  },
  [CardCategory.CODING]: {
    title: "Coding",
    color: "text-violet-500 bg-violet-100",
    iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    bgColor: "bg-category-coding",
  },
  [CardCategory.IMAGE]: {
    title: "Image",
    color: "text-pink-500 bg-pink-100",
    iconPath: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    bgColor: "bg-category-image",
  },
  [CardCategory.MUSIC]: {
    title: "Music",
    color: "text-emerald-500 bg-emerald-100",
    iconPath: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    bgColor: "bg-category-music",
  },
  [CardCategory.VIDEO]: {
    title: "Video",
    color: "text-amber-500 bg-amber-100",
    iconPath: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    bgColor: "bg-category-video",
  }
};

// Difficulty metadata
export const difficultyMetadata = {
  [CardDifficulty.EASY]: {
    label: "Easy",
    color: "bg-difficulty-easy",
  },
  [CardDifficulty.MEDIUM]: {
    label: "Medium",
    color: "bg-difficulty-medium",
  },
  [CardDifficulty.HARD]: {
    label: "Hard",
    color: "bg-difficulty-hard",
  }
};
