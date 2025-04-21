import { motion } from "framer-motion";
import { CardType } from "@/lib/types";
import { categoryMetadata, difficultyMetadata } from "@/lib/data";

interface TaskCardProps {
  card: CardType;
  isAnimating?: boolean;
  className?: string;
  isCompleted?: boolean;
  onToggleComplete?: (cardId: string) => void;
  viewMode?: "single" | "all";
}

export function TaskCard({ 
  card, 
  isAnimating = false, 
  className = "", 
  isCompleted = false,
  onToggleComplete,
  viewMode = "single"
}: TaskCardProps) {
  const { id, title, description, category, difficulty } = card;
  const { bgColor } = categoryMetadata[category];
  const { label, color } = difficultyMetadata[difficulty];
  
  // Animation variants
  const variants = {
    initial: { 
      rotateY: 180, 
      scale: 0.8, 
      opacity: 0 
    },
    animate: { 
      rotateY: 0, 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleToggleComplete = () => {
    if (onToggleComplete) {
      onToggleComplete(id);
    }
  };

  return (
    <motion.div
      className={`relative h-full bg-white rounded-xl shadow-xl p-6 ${className}`}
      initial={isAnimating ? "initial" : false}
      animate={isAnimating ? "animate" : undefined}
      variants={variants}
    >
      <div className={`w-full h-1 ${bgColor} rounded-full absolute top-0 left-0`}></div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-heading font-bold text-xl">{title}</h3>
        <span className={`${color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
          {label}
        </span>
      </div>
      <p className="text-gray-700">{description}</p>
      
      {/* Completion checkbox */}
      <div className="absolute bottom-6 right-6">
        <button 
          className="flex items-center justify-center"
          onClick={handleToggleComplete}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
            {isCompleted && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </button>
      </div>
    </motion.div>
  );
}
