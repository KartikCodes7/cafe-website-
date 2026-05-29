import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Sparkles, Clock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { menuData, menuCategories } from '../utils/menuData';
import type { MenuItem } from '../utils/menuData';
import AIConcierge from '../components/AIConcierge';
import SmartRecommendationPanel from '../components/SmartRecommendationPanel';

// Highly Refined Slow Ambient Floating Particles (Warm Gold/Amber Embers Only)
const AmbientParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
    }> = [];

    // Keep particle count low (15) for absolute visual restraint and cleanliness
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.1 + 0.03),
        speedX: (Math.random() - 0.5) * 0.05,
        opacity: Math.random() * 0.2 + 0.08,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity})`; // #F59E0B Warm Amber
        ctx.shadowColor = '#D97706';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

const Menu = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentTable, setTable, cart, addToCart, cartTotal, orders, currentSessionOrderId } = useAppStore();
  
  // Find active order placed in the current session only
  const activeOrder = orders.find(o => o.id === currentSessionOrderId && o.status !== 'Served');
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<MenuItem | null>(null);
  const [clickedCardId, setClickedCardId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto-hide AI concierge tooltip after 6s
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Read table from query params if present
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam && !currentTable) {
      setTable(`Table ${tableParam}`);
    }
  }, [searchParams, currentTable, setTable]);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setRecentlyAddedItem(item);
    setClickedCardId(item.id);
    // Visual glow disappears after 2s to keep card clean
    setTimeout(() => setClickedCardId(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } }
  };

  return (
    <div className="min-h-screen bg-warm-bg pb-36 text-dark-800 relative overflow-hidden select-none">
      {/* Bowling wood grain lane overlay - extremely faint for luxury look */}
      <div className="absolute inset-0 wood-grain opacity-[0.06] pointer-events-none z-0" />

      {/* Atmospheric slow-rising ambient gold embers */}
      <AmbientParticles />
      
      {/* Extremely subtle, centered warm amber/gold aura in the backdrop */}
      <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] bg-brand-neonPurple/2 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Clean Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-40 glass-light border-b border-white/5 pt-10 pb-4 px-6 shadow-[0_1px_15px_rgba(0,0,0,0.2)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-neonPurple to-brand-neonBlue p-[1px] flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-warm-bg rounded-[7px] flex items-center justify-center text-[10px] font-black text-white tracking-tighter">
                BT
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <motion.div 
                animate={{ y: [0, -1.5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="flex items-center gap-2"
              >
                <span className="text-xs font-black tracking-[0.1em] text-white font-display uppercase">
                  The Bowling Town
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-neonBlue/10 text-brand-neonBlue font-mono font-black uppercase tracking-wider scale-95 shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-neonBlue animate-pulse" />
                  {currentTable || 'Table 4'}
                </span>
              </motion.div>
              {/* Estimated Prep Time Indicator */}
              <span className="text-[9px] font-mono font-medium text-gray-500 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-brand-neonBlue" />
                Est. Prep: 12 Mins
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/order')}
            className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 shadow-sm transition-all group"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-gray-300 group-hover:text-white transition-colors" />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={cartItemsCount}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-neonPurple text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      <main className="px-6 max-w-4xl mx-auto relative z-10">
        {/* Dynamic Active Order Telemetry Banner */}
        {activeOrder && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-warm-card border border-brand-neonBlue/20 shadow-[0_0_20px_rgba(245,158,11,0.08)] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-neonBlue/10 flex items-center justify-center text-brand-neonBlue shrink-0">
                <span className="text-base animate-pulse">👨‍🍳</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white tracking-wide truncate">
                  Your order for {activeOrder.table || 'Table 4'} is Preparing!
                </p>
                <p className="text-[10px] text-brand-neonBlue font-mono font-medium mt-0.5 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-neonBlue animate-pulse" />
                  Status: {activeOrder.status}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/track', { state: { orderId: activeOrder.id } })}
              className="px-4 py-2 bg-brand-neonBlue/10 border border-brand-neonBlue/20 hover:bg-brand-neonBlue hover:text-black hover:border-brand-neonBlue text-[10px] font-black text-brand-neonBlue rounded-xl transition-all tracking-wider uppercase shrink-0"
            >
              Track Order →
            </button>
          </motion.div>
        )}

        {/* Cinematic Hero Section - Deep Vignette, No Diagonal Reflection */}
        <section className="relative mt-8 mb-10 rounded-3xl overflow-hidden border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] h-44 sm:h-52 flex flex-col justify-end p-6 sm:p-8 group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1538510121173-1f8a85c2ec8f?w=1000&q=80')] bg-cover bg-center opacity-30 transition-transform duration-[1200ms] ease-out group-hover:scale-103" />
          
          {/* Deep dark gradient overlay for crystal clear text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/35" />

          <div className="relative z-10">
            <span className="text-[10px] font-mono tracking-[0.3em] text-brand-neonBlue uppercase font-extrabold mb-1 block">
              Luxury Entertainment & Café
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase font-display">
              {currentTable || 'Table 4'} Experience
            </h1>
            <p className="text-xs text-gray-300 mt-1.5 max-w-md font-light leading-relaxed">
              Order artisan pizzas, loaded snacks, and premium mocktails directly to your table.
            </p>
          </div>
        </section>

        {/* Category switcher - Clean Matte Gold Pills */}
        <div className="sticky top-[89px] z-30 bg-warm-bg/75 backdrop-blur-md py-4 -mx-6 px-6 border-b border-white/5 overflow-x-auto hide-scrollbar flex gap-2.5">
          {menuCategories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-neonPurple text-white shadow-md scale-[1.02] border border-brand-neonPurple' 
                    : 'text-gray-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Clean Menu Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
        >
          <AnimatePresence mode="popLayout">
            {menuData.filter(item => item.category === activeCategory).map((item) => {
              const isClicked = clickedCardId === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  className={`group relative flex gap-5 p-5 rounded-3xl bg-warm-card border transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.15)] ${
                    isClicked
                      ? 'border-brand-neonPurple/55 shadow-[0_0_15px_rgba(217,119,6,0.12)] bg-brand-neonPurple/[0.01]'
                      : 'border-white/5 hover:border-brand-neonPurple/25 hover:bg-warm-card/85 hover:shadow-[0_12px_45px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  {/* Left Column: Image with slight scale hover */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5 relative border border-white/5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                  </div>

                  {/* Right Column: Info & Actions */}
                  <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                    <div>
                      <h3 className="text-base font-black text-white tracking-wide group-hover:text-brand-neonBlue transition-colors font-display truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed font-light line-clamp-2">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      {/* Price Glowing Gold/Amber Typography */}
                      <span className="text-brand-neonBlue font-mono font-black tracking-wider text-sm sm:text-base">${item.price.toFixed(2)}</span>
                      
                      <motion.button 
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleAddToCart(item)}
                        className={`h-8.5 px-4 rounded-xl border flex items-center justify-center transition-all text-[10px] font-black tracking-wider gap-1.5 shadow-sm ${
                          isClicked
                            ? 'bg-brand-neonPurple text-white border-brand-neonPurple shadow-[0_0_10px_rgba(217,119,6,0.2)]'
                            : 'bg-white/5 text-gray-200 border-white/10 hover:bg-brand-neonPurple hover:border-brand-neonPurple hover:text-white'
                        }`}
                      >
                        {isClicked ? (
                          <span>ADDED</span>
                        ) : (
                          <>
                            <span>ADD</span>
                            <span className="text-gray-400 group-hover:text-white font-light">+</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Subtle Staff Console Access Link inside Menu Footer */}
        <footer className="mt-16 pt-8 pb-4 border-t border-white/5 text-center flex flex-col items-center gap-1.5 opacity-35 hover:opacity-80 transition-opacity duration-300">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            THE BOWLING TOWN & CAFE
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[9px] text-brand-neonBlue font-mono uppercase tracking-wider hover:underline"
          >
            🔒 Operations Staff Console
          </button>
        </footer>
      </main>

      {/* Floating Checkout Bar Redesign - Clean Smoky Glass */}
      <AnimatePresence>
        {cartItemsCount > 0 && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-40"
          >
            <button
              onClick={() => navigate('/order')}
              className="w-full glass-dark text-white border border-brand-neonBlue/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] px-6 py-5 rounded-2xl flex items-center justify-between group hover:border-brand-neonBlue/50 transition-all duration-300 relative overflow-hidden"
            >
              {/* Glowing gold/amber top line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-neonBlue to-transparent" />
              
              <div className="flex items-center gap-4 relative z-10">
                {/* Bouncy quantity circle badge */}
                <motion.div 
                  key={cartItemsCount}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 10 }}
                  className="w-10 h-10 rounded-full bg-brand-neonBlue/10 flex items-center justify-center text-brand-neonBlue font-black text-sm border border-brand-neonBlue/20"
                >
                  {cartItemsCount}
                </motion.div>
                <div className="text-left">
                  <p className="text-white font-extrabold text-sm tracking-wider uppercase font-display">Confirm Order</p>
                  <p className="text-xs text-gray-400 mt-0.5">Total: <span className="font-mono text-brand-neonBlue font-bold">${cartTotal().toFixed(2)}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 relative z-10">
                <span className="text-xs font-black tracking-wider text-brand-neonBlue group-hover:text-white transition-colors uppercase">View Cart</span>
                <ChevronRight className="w-4 h-4 text-brand-neonBlue group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Concierge Trigger breathing float animation - Matte Obsidian & Gold */}
      <div className="fixed bottom-24 right-6 z-30 md:bottom-6 md:right-auto md:left-6 flex items-center gap-3">
        {/* Breathing FAB */}
        <motion.button 
          onClick={() => setIsAiOpen(true)}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-13 h-13 rounded-full bg-warm-card border border-brand-neonBlue/30 shadow-2xl flex items-center justify-center hover:scale-105 hover:border-brand-neonBlue/60 transition-all group relative"
        >
          <Sparkles className="w-5 h-5 text-brand-neonBlue" />
          <span className="absolute inset-0 rounded-full border border-brand-neonBlue/5 group-hover:border-brand-neonBlue/20 animate-ping pointer-events-none" />
        </motion.button>

        {/* Concierge Tooltip Invitation */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-warm-card border border-white/5 text-white rounded-xl px-4 py-2.5 text-[11px] font-display font-bold shadow-2xl flex items-center gap-1.5 select-none"
            >
              <span>Need recommendations? 🎳</span>
              <button 
                onClick={() => setShowTooltip(false)}
                className="text-white/40 hover:text-white ml-1 font-mono text-[9px]"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AIConcierge isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <SmartRecommendationPanel addedItem={recentlyAddedItem} onClose={() => setRecentlyAddedItem(null)} />
    </div>
  );
};

export default Menu;
