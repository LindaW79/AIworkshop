import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { CardDeck } from "@/components/ui/card-deck";
import { TaskCard } from "@/components/ui/task-card";
import { CardType, CardCategory, DrawnCards, ViewMode } from "@/lib/types";
import { defaultCards, getCardsByCategory, categoryMetadata } from "@/lib/data";
import { ProfileSelector } from "@/components/profile-selector";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Home() {
  // State variables
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCards>({
    [CardCategory.TEXT]: [],
    [CardCategory.CODING]: [],
    [CardCategory.IMAGE]: [],
    [CardCategory.MUSIC]: [],
    [CardCategory.VIDEO]: [],
  });

  // Get profile context
  const { 
    activeProfile, 
    isCardCompleted, 
    toggleCardCompletion,
    resetProfile
  } = useProfile();

  // Fetch cards from API
import { useQuery } from "@tanstack/react-query";

type TaskCardType = {
  id: number | string;
  title: string;
  category: string;
  difficulty: string;
  tools: string[];
};

const fetchTasks = async (): Promise<TaskCardType[]> => {
  const res = await fetch("https://aiworkshop.onrender.com/api/tasks");
  if (!res.ok) throw new Error("Kunde inte hämta uppdrag.");
  return res.json();
};

const { data: cardsData = [], isLoading } = useQuery<TaskCardType[]>({
  queryKey: ["cards"],
  queryFn: fetchTasks,
  staleTime: Infinity,
});


  // Convert card IDs to numbers for compatibility with API
  const cards = cardsData ? cardsData.map(card => ({
    ...card,
    id: card.id.toString() // Ensure IDs are strings for frontend
  })) : defaultCards;

  // Get cards by category
  const getCards = (category: CardCategory) => {
    return getCardsByCategory(cards, category);
  };

  // Draw a random card from the specified category
  const drawCard = (category: CardCategory) => {
    // Hide the current card with animation
    setCurrentCard(null);
    
    // Wait for the exit animation to complete
    setTimeout(() => {
      const categoryCards = getCards(category);
      const drawnCategoryCards = drawnCards[category];
      
      // Filter out cards that have already been drawn
      const availableCards = categoryCards.filter(
        card => !drawnCategoryCards.includes(card.id)
      );
      
      // If all cards have been drawn, reset the drawn cards for this category
      if (availableCards.length === 0) {
        setDrawnCards(prev => ({
          ...prev,
          [category]: []
        }));
        
        // Draw a card now that we've reset
        drawCard(category);
        return;
      }
      
      // Select a random card from available cards
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards[randomIndex];
      
      // Add card ID to drawn cards
      setDrawnCards(prev => ({
        ...prev,
        [category]: [...prev[category], selectedCard.id]
      }));
      
      // Set the current card and animate it
      setIsCardAnimating(true);
      setCurrentCard(selectedCard);
      
      // Switch to single card view if in all cards view
      if (viewMode === "all") {
        setViewMode("single");
      }
    }, 300);
  };

  // Reset all decks
  const resetAllDecks = () => {
    setCurrentCard(null);
    setDrawnCards({
      [CardCategory.TEXT]: [],
      [CardCategory.CODING]: [],
      [CardCategory.IMAGE]: [],
      [CardCategory.MUSIC]: [],
      [CardCategory.VIDEO]: [],
    });
    
    // Reset profile completions if a profile is active
    if (activeProfile) {
      resetProfile();
    }
    
    // Show reset message after a short delay
    setTimeout(() => {
      setIsCardAnimating(true);
    }, 300);
  };

  // Handle toggling card completion
  const handleToggleCompletion = (cardId: string) => {
    if (!activeProfile) return;
    toggleCardCompletion(parseInt(cardId));
  };

  // Check if a card is completed
  const checkCardCompleted = (cardId: string): boolean => {
    if (!activeProfile) return false;
    return isCardCompleted(parseInt(cardId));
  };

  // Handle card animation end
  useEffect(() => {
    if (isCardAnimating) {
      const timeout = setTimeout(() => {
        setIsCardAnimating(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [isCardAnimating]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">AI Workshop Task Cards</h1>
              <p className="mt-2 text-gray-600">Click on a deck to draw a random task card</p>
            </div>
            <ProfileSelector />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Warning */}
        {!activeProfile && (
          <div className="mb-6 p-4 border border-yellow-300 bg-yellow-50 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <p className="text-yellow-700">
              Please select or create a profile to save your task completions.
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button 
              onClick={resetAllDecks}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
            >
              Reset All Decks
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode("single")}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                viewMode === "single" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Single Card View
            </button>
            <button 
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                viewMode === "all" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              View All Cards
            </button>
          </div>
        </div>

        {/* Card Decks */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.values(CardCategory).map((category) => (
            <CardDeck
              key={category}
              category={category}
              cardCount={getCards(category).length}
              onDeckClick={drawCard}
            />
          ))}
        </div>

        {/* Single Card View */}
        <div className={`flex justify-center my-8 ${viewMode === "single" ? "block" : "hidden"}`}>
          <AnimatePresence mode="wait">
            {currentCard ? (
              <div className="h-80 w-full max-w-lg">
                <TaskCard 
                  card={currentCard} 
                  isAnimating={isCardAnimating}
                  className="h-full"
                  isCompleted={checkCardCompleted(currentCard.id)}
                  onToggleComplete={handleToggleCompletion}
                  viewMode="single"
                />
              </div>
            ) : (
              <motion.div
                key="empty-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-80 w-full max-w-lg bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center"
              >
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <p className="text-gray-600 text-center">
                  {Object.values(drawnCards).some(arr => arr.length > 0)
                    ? "Click on a deck to draw a card"
                    : "All decks have been reset. Click on a deck to draw a new card."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* All Cards View */}
        <div className={viewMode === "all" ? "block" : "hidden"}>
          {Object.values(CardCategory).map((category) => (
            <div className="mb-12" key={category}>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className={`w-4 h-4 rounded-full ${categoryMetadata[category].bgColor} mr-2`}></span>
                {categoryMetadata[category].title} Tasks
              </h2>
              
              {/* Group cards by difficulty */}
              {['easy', 'medium', 'hard'].map(difficulty => {
                const cardsOfDifficulty = getCards(category)
                  .filter(card => card.difficulty === difficulty);
                
                if (cardsOfDifficulty.length === 0) return null;
                
                return (
                  <div key={difficulty} className="mb-6">
                    <h3 className="text-lg font-semibold capitalize mb-3">{difficulty} Difficulty</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cardsOfDifficulty.map((card) => (
                        <TaskCard 
                          key={card.id} 
                          card={card} 
                          isCompleted={checkCardCompleted(card.id)}
                          onToggleComplete={handleToggleCompletion}
                          viewMode="all"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
