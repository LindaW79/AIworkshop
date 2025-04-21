import { useState } from "react";
import { motion } from "framer-motion";
import { CardCategory } from "@/lib/types";
import { categoryMetadata } from "@/lib/data";

interface CardDeckProps {
  category: CardCategory;
  cardCount: number;
  onDeckClick: (category: CardCategory) => void;
}

export function CardDeck({ category, cardCount, onDeckClick }: CardDeckProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const { title, iconPath, bgColor } = categoryMetadata[category];

  const handleClick = () => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    
    // Notify parent component about the deck click
    onDeckClick(category);
    
    // Reset the shuffling state after animation completes
    setTimeout(() => {
      setIsShuffling(false);
    }, 800);
  };

  // Variants for the shuffle animation
  const shuffleVariants = {
    initial: { y: 0, rotate: 0 },
    shuffling: {
      y: [-20, 0, -10, 0],
      rotate: [-5, 0, 5, 0],
      transition: { duration: 0.8 }
    }
  };

  // Variants for the hover effect
  const hoverVariants = {
    hover: { y: -10, transition: { duration: 0.3 } }
  };

  return (
    <div className="relative cursor-pointer" data-category={category}>
      <motion.div
        className="h-48 rounded-xl shadow-lg bg-cardBack"
        onClick={handleClick}
        animate={isShuffling ? "shuffling" : "initial"}
        whileHover={!isShuffling ? "hover" : undefined}
        variants={{
          ...shuffleVariants,
          ...hoverVariants
        }}
      >
        <div className="absolute inset-0 rounded-xl bg-gray-200 p-4 flex flex-col justify-center items-center">
          <div className={`w-full h-1 ${bgColor} rounded-full mb-4`}></div>
          <h3 className="font-heading font-bold text-xl text-center">{title}</h3>
          <p className="text-sm text-center mt-2">{cardCount} cards</p>
          <div className={`mt-4 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
