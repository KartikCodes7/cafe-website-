import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Phone, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const Checkout = () => {
  const navigate = useNavigate();
  const { currentTable, setCustomerInfo, customerInfo } = useAppStore();

  const [name, setName] = useState(customerInfo?.name || '');
  const [phone, setPhone] = useState(customerInfo?.phone || '');
  const [instructions, setInstructions] = useState(customerInfo?.instructions || '');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit Mobile Number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setCustomerInfo({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
        instructions: instructions.trim()
      });
      navigate('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col relative overflow-hidden text-white select-none">
      {/* Subtle gold background aura */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-neonPurple/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-light border-b border-white/5 pt-12 pb-4 px-6">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/order')} 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Customer Details</h1>
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-neonBlue uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-neonBlue animate-pulse" />
              {currentTable || 'Table 4'} 🎳
            </span>
          </div>
        </div>
      </header>

      {/* Main Checkout Form */}
      <main className="flex-1 px-6 py-8 max-w-md mx-auto w-full relative z-10 flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Please enter your table dining details to ensure our kitchen and concierge can personalize your experience.
          </p>

          {/* Full Name Input Block */}
          <div className="space-y-2">
            <label className="text-[11px] font-display font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-neonBlue" />
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full bg-warm-card border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-neonBlue transition-all ${
                  errors.name ? 'border-brand-neonPurple' : 'border-white/5'
                }`}
              />
            </div>
            {errors.name && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-[10px] text-brand-neonPurple font-bold bg-brand-neonPurple/5 px-3 py-1.5 rounded-lg border border-brand-neonPurple/15 mt-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errors.name}</span>
              </motion.div>
            )}
          </div>

          {/* Mobile Number Input Block */}
          <div className="space-y-2">
            <label className="text-[11px] font-display font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-neonBlue" />
              Contact Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={10}
                className={`w-full bg-warm-card border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-neonBlue transition-all ${
                  errors.phone ? 'border-brand-neonPurple' : 'border-white/5'
                }`}
              />
            </div>
            {errors.phone && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-[10px] text-brand-neonPurple font-bold bg-brand-neonPurple/5 px-3 py-1.5 rounded-lg border border-brand-neonPurple/15 mt-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errors.phone}</span>
              </motion.div>
            )}
          </div>

          {/* Special Instructions (Optional) */}
          <div className="space-y-2">
            <label className="text-[11px] font-display font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-brand-neonBlue" />
              Special Instructions <span className="text-[9px] text-gray-600 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Make it extra spicy 🌶️ / No ice in drinks / Allergy alerts"
              rows={3}
              className="w-full bg-warm-card border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-neonBlue transition-all resize-none"
            />
          </div>
        </form>

        {/* Submit Block */}
        <div className="mt-8 pt-6 border-t border-white/5 bg-warm-bg z-20">
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl bg-brand-neonPurple hover:bg-brand-neonBlue text-white font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-neonPurple/10"
          >
            Continue to Payment
          </button>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
