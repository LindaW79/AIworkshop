import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { CardDeck } from "@/components/ui/card-deck";
import { TaskCard } from "@/components/ui/task-card";
import { CardType, CardCategory, DrawnCards, ViewMode } from "@/lib/types";
import { getCardsByCategory, categoryMetadata } from "@/lib/data";
import { ProfileSelector } from "@/components/profile-selector";
import { useProfile } from "@/hooks/use-profile";
import { AlertCircle } from "lucide-react";

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

export default function Home() {
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

  const { activeProfile, isCardCompleted, toggleCardCompletion, resetProfile } = useProfile();

  const { data: cardsData = [], isLoading } = useQuery<TaskCardType[]>({
    queryKey: ["cards"],
    queryFn: fetchTasks,
    staleTime: Infinity,
  });

  const cards = cardsData.map(card => ({
    ...card,
    id: card.id.toString()
  }));

  const getCards = (category: CardCategory) => {
    return getCardsByCategory(cards, category);
  };

  const drawCard = (category: CardCategory) => {
    setCurrentCard(null);
    setTimeout(() => {
      const categoryCards = getCards(category);
      const drawnCategoryCards = drawnCards[category];
      const availableCards = categoryCards.filter(
        card => !drawnCategoryCards.includes(card.id)
      );
      if (availableCards.length === 0) {
        setDrawnCards(prev => ({
          ...prev,
          [category]: []
        }));
        drawCard(category);
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards[randomIndex];
      setDrawnCards(prev => ({
        ...prev,
        [category]: [...prev[category], selectedCard.id]
      }));
      setIsCardAnimating(true);
      setCurrentCard(selectedCard);
      if (viewMode === "all") {
        setViewMode("single");
      }
    }, 300);
  };

  const resetAllDecks = () => {
    setCurrentCard(null);
    setDrawnCards({
      [CardCategory.TEXT]: [],
      [CardCategory.CODING]: [],
      [CardCategory.IMAGE]: [],
      [CardCategory.MUSIC]: [],
      [CardCategory.VIDEO]: [],
    });
    if (activeProfile) resetProfile();
    setTimeout(() => {
      setIsCardAnimating(true);
    }, 300);
  };

  const handleToggleCompletion = (cardId: string) => {
    if (!activeProfile) return;
    toggleCardCompletion(parseInt(cardId));
  };

  const checkCardCompleted = (cardId: string): boolean => {
    if (!activeProfile) return false;
    return isCardCompleted(parseInt(cardId));
  };

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
        {!activeProfile && (
          <div className="mb-6 p-4 border border-yellow-300 bg-yellow-50 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <p className="text-yellow-700">
              Please select or create a profile to save your task completions.
            </p>
          </div>
        )}

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
                viewMode === "single" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Single Card View
            </button>
            <button 
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                viewMode === "all" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              View All Cards
            </button>
          </div>
        </div>

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
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
      </main>
    </div>
  );
}
