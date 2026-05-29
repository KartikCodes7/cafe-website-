import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Minus, Plus, CreditCard, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getRecommendationsForCart } from '../utils/recommendations';

const Order = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal, currentTable } = useAppStore();
  const { recommendations: upsellRecommendations } = getRecommendationsForCart(cart);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-brand-neonPurple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-neonBlue/5 blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-40 bg-warm-bg/60 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Your Order</h1>
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-neonBlue uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-neonBlue animate-pulse" />
              {currentTable || 'Table 4'} 🎳
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full relative z-10">
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-[55vh] text-center"
          >
            <div className="w-24 h-24 rounded-full bg-warm-card/50 border border-white/5 flex items-center justify-center mb-6">
              <span className="text-5xl">🎳</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-xs leading-relaxed">
              Browse our premium menu and add delicious items to your order.
            </p>
            <button 
              onClick={() => navigate('/menu')}
              className="px-8 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all text-sm font-semibold tracking-wider uppercase"
            >
              Browse Menu
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{cartItemsCount} items in cart</h2>
            </div>

            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  className="flex items-center justify-between p-5 rounded-2xl bg-warm-card border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-brand-neonBlue text-sm font-mono font-bold mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                      {item.quantity > 1 && (
                        <span className="text-gray-500 font-normal ml-2">@ ${item.price.toFixed(2)} ea.</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-1 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* AI Upsell Shelf */}
            {upsellRecommendations.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded bg-brand-neonBlue/10 flex items-center justify-center text-brand-neonBlue">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Complete Your Table Combo 🎳</h3>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {upsellRecommendations.map((item) => (
                    <div 
                      key={item.id}
                      className="flex-shrink-0 w-64 p-4 rounded-xl bg-warm-card border border-white/5 hover:border-brand-neonBlue/20 hover:bg-warm-card/80 transition-all flex flex-col justify-between group shadow-lg"
                    >
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700 border border-white/5">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate tracking-wide group-hover:text-brand-neonBlue transition-colors">{item.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-1 font-light leading-relaxed line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <span className="text-brand-neonBlue font-mono text-xs font-bold">${item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-brand-neonPurple hover:border-brand-neonPurple hover:text-white text-[10px] font-extrabold transition-all"
                        >
                          ADD +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {cart.length > 0 && (
        <div className="sticky bottom-0 glass-light border-t border-white/5 p-6 pb-8 z-50">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Subtotal</span>
                <span>${cartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Service Fee</span>
                <span>$0.00</span>
              </div>
              <div className="h-[1px] bg-white/5 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-2xl font-extrabold text-white">${cartTotal().toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-xl bg-brand-neonPurple hover:bg-brand-neonBlue text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all tracking-wide"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
