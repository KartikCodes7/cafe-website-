import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { MenuItem } from '../utils/menuData';
import { getRecommendationsForCart } from '../utils/recommendations';

interface SmartRecommendationPanelProps {
  addedItem: MenuItem | null;
  onClose: () => void;
}

const SmartRecommendationPanel = ({ addedItem, onClose }: SmartRecommendationPanelProps) => {
  const { cart, addToCart } = useAppStore();
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(8); // 8 seconds countdown

  // Get recommendations
  const recommendationData = getRecommendationsForCart(
    addedItem ? [...cart, { id: addedItem.id, name: addedItem.name, price: addedItem.price, quantity: 1 }] : cart
  );

  const { headline, tagline, recommendations } = recommendationData;

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!addedItem) return;
    
    // Reset states
    setTimeLeft(8);
    setAddedIds([]);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [addedItem, onClose]);

  const handleAddItem = (item: MenuItem) => {
    addToCart(item);
    setAddedIds((prev) => [...prev, item.id]);
    // Reset timer to give the user a bit more time if they are actively interacting
    setTimeLeft(5);
  };

  if (!addedItem || recommendations.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-28 left-4 right-4 md:left-auto md:right-6 md:w-[420px] bg-warm-card border border-white/5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 overflow-hidden"
      >
        {/* Neon Glow Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-brand-neonBlue via-brand-neonPurple to-brand-neonBlue animate-pulse" />

        {/* Timer Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-[2px] bg-brand-neonBlue transition-all duration-100 ease-linear"
          style={{ width: `${(timeLeft / 8) * 100}%` }}
        />

        {/* Card Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-neonPurple/10 border border-brand-neonPurple/20 flex items-center justify-center text-brand-neonPurple">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-wide uppercase">{headline}</h4>
                <p className="text-[10px] text-gray-400 font-light mt-0.5">{tagline}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Added Item confirmation toast-let inside card */}
          <div className="bg-white/5 rounded-xl border border-white/5 p-2.5 mb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700">
              <img src={addedItem.image} alt={addedItem.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono tracking-wider text-brand-neonBlue uppercase font-bold">Added To Cart</p>
              <p className="text-xs text-white font-medium truncate mt-0.5">{addedItem.name}</p>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-3">
            {recommendations.map((item) => {
              const isAdded = addedIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-neonBlue/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700 relative border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-white truncate tracking-wide group-hover:text-brand-neonBlue transition-colors">
                        {item.name}
                      </h5>
                      <p className="text-[10px] text-gray-400 mt-1 font-mono tracking-wider font-bold text-brand-neonBlue">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => !isAdded && handleAddItem(item)}
                    disabled={isAdded}
                    className={`h-8 px-3.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                      isAdded
                        ? 'bg-brand-neonBlue/10 text-brand-neonBlue border border-brand-neonBlue/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                        : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-brand-neonPurple hover:border-brand-neonPurple hover:text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartRecommendationPanel;
