import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, Clock, Loader2, Sparkles, ChefHat } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { OrderStatus } from '../store/useAppStore';

const Track = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, currentSessionOrderId } = useAppStore();
  
  // Derived state to remain reactive to store updates
  const orderId = location.state?.orderId || currentSessionOrderId;
  const order = orders.find(o => o.id === orderId);

  const [prepProgress, setPrepProgress] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);

  // Initialize and synchronize countdown timer based on order status
  useEffect(() => {
    if (!order) return;
    
    if (order.status === 'Pending') {
      setTimeLeftSeconds(900); // 15 minutes
    } else if (order.status === 'Preparing') {
      setTimeLeftSeconds(prev => (prev === null || prev > 720) ? 720 : prev);
    } else {
      setTimeLeftSeconds(0);
    }
  }, [order?.status]);

  // Decrement timer every second
  useEffect(() => {
    if (timeLeftSeconds === null || timeLeftSeconds <= 0) return;
    if (order?.status === 'Ready' || order?.status === 'Served') return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds, order?.status]);

  const formatTimeLeft = () => {
    if (timeLeftSeconds === null) return '12–18 MINS';
    if (timeLeftSeconds === 0) {
      if (order?.status === 'Served') return 'DELIVERED! 🎳';
      return 'READY FOR PICKUP! 🍕';
    }
    const mins = Math.floor(timeLeftSeconds / 60);
    const secs = timeLeftSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} MINS`;
  };

  // Premium Web Audio synthesized luxury chord chime on screen mount
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq: number, delay: number, dur: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + dur);
      };

      // Play soft luxury chime chord (C5 -> E5 -> G5 -> C6)
      playTone(523.25, 0, 0.5, 0.1);     // C5
      playTone(659.25, 0.1, 0.5, 0.1);    // E5
      playTone(783.99, 0.2, 0.5, 0.1);    // G5
      playTone(1046.50, 0.3, 1.0, 0.12);  // C6
    } catch (err) {
      console.warn('Audio synthesis failed:', err);
    }
  }, []);

  // Animate estimated progress serve bar
  useEffect(() => {
    if (!order) return;
    
    // Simulate gradual progress increase based on status
    let target = 15;
    if (order.status === 'Preparing') target = 45;
    if (order.status === 'Ready') target = 85;
    if (order.status === 'Served') target = 100;

    const interval = setInterval(() => {
      setPrepProgress((prev) => {
        if (prev >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center text-white px-6">
        <div className="w-20 h-20 rounded-full bg-warm-card border border-white/5 flex items-center justify-center mb-6">
          <span className="text-4xl">🎳</span>
        </div>
        <h2 className="text-lg font-semibold mb-2">No active orders</h2>
        <p className="text-sm text-gray-400 mb-6">Place an order from the menu to track it here.</p>
        <button onClick={() => navigate('/menu')} className="px-6 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-sm font-semibold">
          Browse Menu
        </button>
      </div>
    );
  }

  // 5-Stage Live Timeline mapping Table ordering
  const steps: { label: string; description: string; status: OrderStatus | 'Paid' }[] = [
    { label: 'Order Received', description: 'Gourmet order has been confirmed', status: 'Pending' },
    { label: 'Payment Confirmed', description: order.paymentMethod === 'UPI' ? 'Paid digitally via UPI' : 'Approved to pay at counter', status: 'Paid' },
    { label: 'Preparing Food', description: 'Chef is crafting your selection', status: 'Preparing' },
    { label: 'Ready for Pickup', description: 'Hot order is ready at the counter', status: 'Ready' },
    { label: 'Delivered to Table', description: `Served warm at ${order.table || 'your table'}`, status: 'Served' },
  ];

  // Map active progress steps
  const getActiveIndex = () => {
    if (order.status === 'Served') return 4;
    if (order.status === 'Ready') return 3;
    if (order.status === 'Preparing') return 2;
    // Payment is always "confirmed" or "approved" right after Pending is registered
    if (order.status === 'Pending') return 1;
    return 0;
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col relative overflow-hidden text-white select-none">
      {/* Subtle gold overlay aura */}
      <div className="absolute top-[-10%] left-[20%] right-[20%] bottom-[20%] bg-brand-neonPurple/2 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-light border-b border-white/5 pt-12 pb-4 px-6 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/menu')} 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Preparing Stage</h1>
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-neonBlue uppercase flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-neonBlue animate-pulse" />
              Serving {order.table || 'Table 4'} 🎳
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-md mx-auto w-full relative z-10 space-y-6">
        {/* Dynamic Welcome Greeting */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center space-y-2 py-4"
        >
          <div className="w-20 h-20 rounded-full border border-white/5 bg-warm-card flex items-center justify-center shadow-lg relative mx-auto mb-4">
            {order.status !== 'Served' && (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} 
                className="absolute inset-0 rounded-full border border-transparent border-t-brand-neonBlue/30" 
              />
            )}
            {order.status === 'Served' ? (
              <CheckCircle2 className="w-10 h-10 text-brand-neonBlue" />
            ) : (
              <Loader2 className="w-10 h-10 text-brand-neonBlue animate-spin" style={{ animationDuration: '3s' }} />
            )}
          </div>
          <h2 className="text-lg font-black tracking-wide font-display">
            Hi {order.customerName} 👋
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Your table order is now being processed. Our kitchen will serve everything fresh!
          </p>
        </motion.section>

        {/* Live Serving Progress Clock */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-warm-card border border-white/5 rounded-3xl p-5 space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-neonBlue" />
              <span className="text-[11px] font-display font-extrabold uppercase tracking-wider text-gray-400">Est. Serving Time</span>
            </div>
            <span className="text-sm font-black font-mono text-brand-neonBlue tracking-wide">{formatTimeLeft()}</span>
          </div>

          {/* Glowing countdown serving progress bar */}
          <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-brand-neonBlue rounded-full shadow-[0_0_12px_rgba(0,217,255,0.6)] transition-all duration-300 ease-out"
              style={{ width: `${prepProgress}%` }}
            />
          </div>
        </motion.section>

        {/* Chef preparing live notification banner */}
        {order.status === 'Preparing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-neonPurple/5 border border-brand-neonPurple/10 rounded-2xl p-4 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-neonPurple/10 flex items-center justify-center text-brand-neonPurple shrink-0 animate-bounce">
              <ChefHat className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white tracking-wide">Chef has started cooking 🍕</p>
              <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                Your ingredients have been freshly sliced. Serving time is updated live.
              </p>
            </div>
          </motion.div>
        )}

        {/* Dynamic Order Summary block */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-warm-card border border-white/5 rounded-3xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-neonBlue" />
            <span className="text-[11px] font-display font-extrabold uppercase tracking-wider text-gray-400">Order Summary</span>
          </div>
          <div className="space-y-3.5 max-h-[140px] overflow-y-auto hide-scrollbar">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-light truncate max-w-[80%]">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-gray-400 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="h-[1px] bg-white/5 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300 font-semibold">Total serving cost</span>
            <span className="text-base font-black font-mono text-brand-neonBlue">${order.total.toFixed(2)}</span>
          </div>
          {order.specialInstructions && (
            <div className="mt-3 p-3 rounded-xl bg-brand-neonBlue/5 border border-brand-neonBlue/10 text-[10px] text-gray-400 leading-relaxed font-light">
              <span className="font-bold text-brand-neonBlue uppercase tracking-wider block mb-1">Kitchen Instructions:</span>
              "{order.specialInstructions}"
            </div>
          )}
        </motion.section>

        {/* 5-Stage Timeline */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative pl-4 space-y-6 pt-4"
        >
          <div className="absolute left-[19px] top-6 bottom-6 w-[1.5px] bg-white/5" />
          {steps.map((step, index) => {
            const isCompleted = index <= activeIndex;
            const isCurrent = index === activeIndex;
            
            return (
              <div key={step.label} className="flex items-start gap-4.5 relative group">
                {/* Circle marker with glow */}
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-700 ${
                    isCompleted 
                      ? 'bg-brand-neonBlue text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                      : 'bg-warm-card border border-white/10 text-white/20'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-black" />
                  ) : (
                    <Circle className="w-3 h-3 text-white/20 fill-white/20" />
                  )}
                </div>

                <div className="flex-1 pt-1 min-w-0">
                  <h3 
                    className={`text-xs font-black tracking-wide font-display transition-colors duration-500 uppercase ${
                      isCompleted ? 'text-white' : 'text-gray-600'
                    } ${isCurrent ? 'text-brand-neonBlue font-black' : ''}`}
                  >
                    {step.label}
                  </h3>
                  <p 
                    className={`text-[10px] mt-0.5 font-light leading-relaxed truncate transition-colors duration-500 ${
                      isCompleted ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.section>
      </main>
    </div>
  );
};

export default Track;
