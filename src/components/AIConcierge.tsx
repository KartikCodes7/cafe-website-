import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getRecommendationsForCart } from '../utils/recommendations';
import { menuData } from '../utils/menuData';

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const AIConcierge = ({ isOpen, onClose }: AIConciergeProps) => {
  const { cart, addToCart } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [addedChipIds, setAddedChipIds] = useState<string[]>([]);

  // Get active recommendation data
  const { recommendations } = getRecommendationsForCart(cart);

  // Generate context-aware AI greeting based on cart
  const getAiGreeting = () => {
    if (cart.length === 0) {
      return "Welcome! I am your premium café concierge. 🎳 What can I get started for your table today? I highly recommend our double-patty Truffle Veg Burger or signature cold brews.";
    }

    const hasPizza = cart.some(i => i.id.startsWith('p'));
    const hasBurger = cart.some(i => i.id.startsWith('b'));
    const hasPasta = cart.some(i => i.id.startsWith('pa'));

    if (hasPizza) {
      return "Superb choice with the pizza! 🍕 Would you like to complete the combo with our freshly baked Cheese Garlic Bread or a chilled Nitro Cold Brew for the table?";
    }
    if (hasBurger) {
      return "Ah, the Smash Burger! 🍔 Nothing pairs better than our Crispy Peri Peri Fries and a thick Oreo Blast Shake. Shall I add them to your table order?";
    }
    if (hasPasta) {
      return "Excellent pasta selection! 🍝 Our Garlic Bread and signature Berry Spark Mojito are the absolute perfect pairing to balance a rich pasta. Want to add them?";
    }

    return `Gourmet taste! I see you have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart. Would you like to finish off with our warm Choco Lava Blast or Nutella Brownie for dessert? 🍰`;
  };

  // Initialize greeting on open or when cart changes (if chat is empty)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          sender: 'ai',
          text: getAiGreeting()
        }
      ]);
    }
  }, [isOpen, cart, messages.length]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsgId = `msg-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: 'user', text: inputText }
    ];
    setMessages(newMessages);
    setInputText('');

    // Simulate luxury waiter response
    setTimeout(() => {
      const responseMsgId = `msg-${Date.now() + 1}`;
      let aiText = "Of course! Let me get that prepared for your table order. Is there anything else you would like to add from our gourmet selections?";
      
      const lowerText = inputText.toLowerCase();
      if (lowerText.includes('fries') || lowerText.includes('peri peri')) {
        const item = menuData.find(i => i.id === 's2');
        if (item) {
          addToCart(item);
          aiText = "Absolutely! I have added our signature Crispy Peri Peri Fries ($7.00) to your table order. They're seasoned perfectly! 🍟";
        }
      } else if (lowerText.includes('garlic bread')) {
        const item = menuData.find(i => i.id === 's3');
        if (item) {
          addToCart(item);
          aiText = "Wonderful choice! Added the hot Cheese Garlic Bread ($8.00) to your table order. It'll arrive warm and bubbly! 🧀";
        }
      } else if (lowerText.includes('shake') || lowerText.includes('oreo')) {
        const item = menuData.find(i => i.id === 'v5');
        if (item) {
          addToCart(item);
          aiText = "Gourmet addition! The thick Oreo Blast Shake ($8.00) has been added to your table order. 🥤";
        }
      } else if (lowerText.includes('cold brew') || lowerText.includes('coffee')) {
        const item = menuData.find(i => i.id === 'v1');
        if (item) {
          addToCart(item);
          aiText = "Excellent. I have added our signature Nitro Cold Brew ($6.00) to your table order. Smooth and refreshing! ☕";
        }
      } else if (lowerText.includes('dessert') || lowerText.includes('brownie')) {
        const item = menuData.find(i => i.id === 'd2');
        if (item) {
          addToCart(item);
          aiText = "Delicious choice! Added the dense Nutella Brownie ($8.00) to your table order. 🍰";
        }
      }

      setMessages(prev => [...prev, { id: responseMsgId, sender: 'ai', text: aiText }]);
    }, 1000);
  };

  const handleChipClick = (itemId: string, itemName: string) => {
    const item = menuData.find(i => i.id === itemId);
    if (!item) return;

    addToCart(item);
    setAddedChipIds(prev => [...prev, itemId]);

    // Append conversation bubble
    const userMsgId = `chip-user-${Date.now()}`;
    const aiMsgId = `chip-ai-${Date.now()}`;

    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: `Yes, add the ${itemName} to my table order.`
      },
      {
        id: aiMsgId,
        sender: 'ai',
        text: `Perfect choice! I have added the ${itemName} ($${item.price.toFixed(2)}) directly to your table order. 🎳 Ready to check out, or is there anything else I can recommend?`
      }
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 md:right-auto md:left-6 w-[360px] max-w-[calc(100vw-48px)] h-[480px] bg-warm-card/95 border border-white/5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden"
        >
          {/* Neon Purple glow bar */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-brand-neonPurple via-brand-neonBlue to-brand-neonPurple animate-pulse" />

          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/50">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-brand-neonPurple/10 flex items-center justify-center text-brand-neonPurple">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-extrabold tracking-wider text-white uppercase">Table Concierge AI</span>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 hide-scrollbar">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'ai'
                    ? 'self-start bg-white/5 text-gray-200 border border-white/5 rounded-tl-sm'
                    : 'self-end bg-brand-neonPurple/10 text-white border border-brand-neonPurple/20 rounded-tr-sm shadow-[0_0_15px_rgba(161,0,255,0.1)]'
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>

          {/* Interactive Chips Shelf */}
          {recommendations.length > 0 && (
            <div className="px-4 py-2 border-t border-white/5 bg-black/30">
              <p className="text-[9px] font-mono tracking-wider text-brand-neonBlue uppercase font-bold mb-1.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-brand-neonBlue animate-pulse" />
                Concierge Suggestions
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto hide-scrollbar">
                {recommendations.map((item) => {
                  const isAdded = addedChipIds.includes(item.id);
                  return (
                    <button 
                      key={item.id}
                      onClick={() => !isAdded && handleChipClick(item.id, item.name)}
                      disabled={isAdded}
                      className={`text-[10px] px-2.5 py-1.5 rounded-full border flex items-center gap-1.5 transition-all duration-300 ${
                        isAdded
                          ? 'bg-brand-neonBlue/15 text-brand-neonBlue border-brand-neonBlue/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-brand-neonPurple/25 hover:border-brand-neonPurple/50 hover:text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3 text-brand-neonBlue" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <span>+ {item.name}</span>
                          <span className="text-brand-neonBlue font-mono font-medium">${item.price}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-black/50">
            <div className="relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask your table concierge..."
                className="w-full bg-dark-700/50 border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-neonPurple/50 transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center text-brand-neonPurple hover:text-brand-neonBlue transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIConcierge;
