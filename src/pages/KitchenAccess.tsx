import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const KitchenAccess = () => {
  const navigate = useNavigate();
  const authenticateManager = useAppStore(state => state.authenticateManager);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (password === 'admin123') {
      setIsSubmitting(true);
      setError(null);
      
      // Simulate premium console handshaking delay
      setTimeout(() => {
        const staffName = name.trim() ? name.trim() : 'Chef';
        authenticateManager(staffName);
        navigate('/dashboard');
      }, 1200);
    } else {
      // Trigger card shake & ruby red glow
      setShake(true);
      setError('Invalid Staff Access Code');
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center relative overflow-hidden text-white px-6">
      {/* Background glow auras */}
      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-brand-neonPurple/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-brand-neonBlue/5 blur-[160px] pointer-events-none" />

      {/* Back button to public menu */}
      <button 
        onClick={() => navigate('/menu')} 
        className="absolute top-12 left-6 md:left-12 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-20 hover:bg-white/10"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-8 md:top-12 z-50 bg-red-950/80 border border-red-500/25 text-red-200 px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] flex items-center gap-3 backdrop-blur-xl max-w-sm w-[90%]"
          >
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Access Denied</p>
              <p className="text-red-300/80 mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glassmorphic Card Container */}
      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-md bg-warm-card border rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] relative overflow-hidden transition-colors duration-300 ${
          error ? 'border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.15)] bg-red-950/[0.01]' : 'border-white/5 hover:border-brand-neonBlue/20 shadow-2xl'
        }`}
      >
        {/* Glow Top Line */}
        <div className={`absolute top-0 left-0 right-0 h-[1.5px] transition-colors duration-500 ${
          error ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-gradient-to-r from-transparent via-brand-neonBlue to-transparent'
        }`} />

        {/* Console Beacon & Header */}
        <div className="flex flex-col items-center text-center space-y-3.5 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-neonBlue/5 border border-brand-neonBlue/10 text-[9px] font-mono tracking-widest text-brand-neonBlue font-semibold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-neonBlue animate-pulse" />
            Secured Operational Console
          </div>
          <div>
            <h1 className="text-2xl font-black font-display tracking-wider uppercase">STAFF ACCESS PORTAL</h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">
              Authorized personnel credentials required
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Staff Name (Optional) */}
          <div className="space-y-2">
            <label className="text-[10px] font-display font-extrabold uppercase tracking-wider text-gray-400">
              Staff Identity <span className="text-[8px] text-gray-600 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chef Sameer"
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-neonBlue transition-all"
            />
          </div>

          {/* Password (Required) */}
          <div className="space-y-2">
            <label className="text-[10px] font-display font-extrabold uppercase tracking-wider text-gray-400">
              Access Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if(error) setError(null); }}
                placeholder="••••••••••••"
                required
                className="w-full bg-black/40 border border-white/5 rounded-xl pl-4 pr-11 py-3.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-neonBlue transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-brand-neonPurple hover:bg-brand-neonBlue text-white font-bold text-sm tracking-wider uppercase transition-colors shadow-lg shadow-brand-neonPurple/10 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Handshaking...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Authenticate Console
              </>
            )}
          </button>
        </form>

        {/* Demo Help Note */}
        <div className="mt-6 text-center text-[10px] text-gray-600 font-mono">
          Demo passcode: <span className="text-brand-neonBlue font-semibold bg-brand-neonBlue/5 px-1.5 py-0.5 rounded">admin123</span>
        </div>
      </motion.div>
    </div>
  );
};

export default KitchenAccess;
