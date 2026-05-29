import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smartphone, Store, Clock, CheckCircle2, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { PaymentMethod } from '../store/useAppStore';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, currentTable, clearCart, addOrder, customerInfo, setCurrentSessionOrderId } = useAppStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Failsafe redirect to checkout if user details are missing
  useEffect(() => {
    if (!customerInfo && cart.length > 0) {
      navigate('/checkout');
    }
  }, [customerInfo, cart, navigate]);

  const handleConfirmPayment = () => {
    if (!selectedMethod || cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        items: [...cart],
        total: cartTotal(),
        status: 'Pending' as const,
        table: currentTable || 'Table 4',
        time: new Date().toISOString(),
        paymentMethod: selectedMethod,
        customerName: customerInfo?.name || 'Anonymous',
        customerPhone: customerInfo?.phone || '0000000000',
        specialInstructions: customerInfo?.instructions || '',
      };
      addOrder(newOrder);
      setCurrentSessionOrderId(newOrder.id); // Save order ID of the active session
      clearCart();
      navigate('/track', { state: { orderId: newOrder.id } });
    }, selectedMethod === 'UPI' ? 2200 : 800);
  };

  if (cart.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-brand-neonPurple/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-brand-neonBlue/5 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-40 glass-light border-b border-white/5 pt-12 pb-4 px-6">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Payment</h1>
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-neonBlue uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-neonBlue animate-pulse" />
              Serving {currentTable || 'Table 4'} 🎳
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-lg mx-auto w-full relative z-10 space-y-8">
        {/* Order Summary */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-warm-card border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Order Summary</h2>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-white/5 text-[10px] font-bold text-gray-300 flex items-center justify-center">{item.quantity}x</span>
                  <span className="text-white">{item.name}</span>
                </div>
                <span className="text-gray-400 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="h-[1px] bg-white/5" />
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-semibold">Total</span>
            <span className="text-xl font-extrabold text-white font-mono">${cartTotal().toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated preparation: <span className="text-brand-neonBlue font-semibold">12–18 mins</span></span>
          </div>
        </motion.section>

        {/* Payment Methods */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Choose Payment Method</h2>
          <div className="grid gap-4">
            {/* UPI */}
            <button
              onClick={() => setSelectedMethod('UPI')}
              className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                selectedMethod === 'UPI'
                  ? 'border-brand-neonBlue/40 bg-brand-neonBlue/5 shadow-[0_0_25px_rgba(0,240,255,0.08)]'
                  : 'border-white/5 bg-warm-card hover:border-white/10 hover:bg-warm-card/85'
              }`}
            >
              {selectedMethod === 'UPI' && <div className="absolute top-4 right-4"><CheckCircle2 className="w-5 h-5 text-brand-neonBlue" /></div>}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMethod === 'UPI' ? 'bg-brand-neonBlue/10' : 'bg-white/5'}`}>
                  <Smartphone className="w-6 h-6 text-brand-neonBlue" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Pay via UPI</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Scan QR code to pay instantly via Google Pay, PhonePe, or Paytm.</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 tracking-wider">GPay</div>
                    <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 tracking-wider">PhonePe</div>
                    <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 tracking-wider">Paytm</div>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {selectedMethod === 'UPI' && (
                  <motion.div initial={{ height: 0, opacity: 0, marginTop: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: 20 }} exit={{ height: 0, opacity: 0, marginTop: 0 }} className="overflow-hidden">
                    <div className="flex flex-col items-center p-6 bg-white rounded-xl">
                      <div className="w-40 h-40 bg-white rounded-lg p-2 relative flex items-center justify-center">
                        <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-[2px]">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className="rounded-[1px]" style={{ backgroundColor: Math.random() > 0.45 ? '#111' : 'white' }} />
                          ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
                            <span className="text-base font-extrabold text-dark-900">BT</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-dark-900 text-xs font-semibold mt-3">Scan with any UPI app</p>
                      <p className="text-gray-500 text-[10px] mt-1">bowlingtown@ybl</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Pay at Counter */}
            <button
              onClick={() => setSelectedMethod('Counter')}
              className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                selectedMethod === 'Counter'
                  ? 'border-brand-gold/40 bg-brand-gold/5 shadow-[0_0_25px_rgba(255,215,0,0.06)]'
                  : 'border-white/5 bg-warm-card hover:border-white/10 hover:bg-warm-card/85'
              }`}
            >
              {selectedMethod === 'Counter' && <div className="absolute top-4 right-4"><CheckCircle2 className="w-5 h-5 text-brand-gold" /></div>}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMethod === 'Counter' ? 'bg-brand-gold/10' : 'bg-white/5'}`}>
                  <Store className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Pay at Counter</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Place your order now and pay at the counter when you're ready. Cash or card accepted.</p>
                </div>
              </div>
            </button>
          </div>
        </motion.section>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pb-24">
          <Shield className="w-3.5 h-3.5" />
          <span>All transactions are secure and encrypted</span>
        </div>
      </main>

      {/* Confirm Button */}
      <AnimatePresence>
        {selectedMethod && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed bottom-0 left-0 right-0 p-6 pb-8 glass-light border-t border-white/5 z-50">
            <div className="max-w-lg mx-auto">
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all tracking-wide relative overflow-hidden ${
                  isProcessing
                    ? 'bg-dark-800 text-gray-400 cursor-wait border border-white/10'
                    : selectedMethod === 'UPI'
                      ? 'bg-brand-neonPurple hover:bg-brand-neonBlue text-white hover:opacity-95'
                      : 'bg-brand-neonPurple hover:bg-brand-neonBlue text-white hover:opacity-95'
                }`}
              >
                {isProcessing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-gray-500 border-t-brand-neonBlue rounded-full" />
                    {selectedMethod === 'UPI' ? 'Processing UPI Payment...' : 'Placing Order...'}
                    <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {selectedMethod === 'UPI' ? 'Confirm UPI Payment' : 'Place Order — Pay at Counter'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;
