import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shuffle {
    0% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-20px) rotate(-5deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-10px) rotate(5deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }
  
  @keyframes cardReveal {
    0% { transform: rotateY(180deg) scale(0.8); opacity: 0; }
    100% { transform: rotateY(0deg) scale(1); opacity: 1; }
  }
  
  .card-animate {
    animation: cardReveal 0.6s ease-out forwards;
  }
  
  .shuffle-animate {
    animation: shuffle 0.8s ease-in-out;
  }
  
  .bg-category-text { background-color: #3B82F6; }
  .bg-category-coding { background-color: #8B5CF6; }
  .bg-category-image { background-color: #EC4899; }
  .bg-category-music { background-color: #10B981; }
  .bg-category-video { background-color: #F59E0B; }
  
  .bg-difficulty-easy { background-color: #22C55E; }
  .bg-difficulty-medium { background-color: #F59E0B; }
  .bg-difficulty-hard { background-color: #EF4444; }
`;
document.head.appendChild(style);

// Add Google Fonts
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&display=swap';
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(<App />);
