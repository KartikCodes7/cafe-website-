import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const lanes = [
  { id: 1, type: 'Standard', status: 'available' },
  { id: 2, type: 'Standard', status: 'booked' },
  { id: 3, type: 'Standard', status: 'available' },
  { id: 4, type: 'VIP', status: 'available' },
  { id: 5, type: 'VIP', status: 'booked' },
  { id: 6, type: 'VIP', status: 'available' },
];

const BookLane = () => {
  const navigate = useNavigate();
  const [selectedLane, setSelectedLane] = useState<number | null>(null);
  
  return (
    <div className="min-h-screen bg-warm-bg flex flex-col pb-24 relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-brand-neonPurple/5 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-40 glass-light border-b border-white/5 pt-12 pb-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/menu')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Book a Bowling Lane</h1>
          <p className="text-sm text-brand-neonBlue">Premium Bowling Experience</p>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full space-y-10 relative z-10">
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-warm-card border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
            <Calendar className="w-5 h-5 text-brand-neonPurple" />
            <span className="text-sm text-gray-400">Date</span>
            <span className="text-white font-medium">Today</span>
          </div>
          <div className="bg-warm-card border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
            <Clock className="w-5 h-5 text-brand-neonPurple" />
            <span className="text-sm text-gray-400">Time</span>
            <span className="text-white font-medium">8:00 PM</span>
          </div>
          <div className="bg-warm-card border border-white/5 p-4 rounded-2xl flex flex-col gap-2 col-span-2 md:col-span-1">
            <Users className="w-5 h-5 text-brand-neonPurple" />
            <span className="text-sm text-gray-400">Players</span>
            <span className="text-white font-medium">4 People</span>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-6">Select Bowling Lane</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {lanes.map(lane => (
              <button
                key={lane.id}
                disabled={lane.status === 'booked'}
                onClick={() => setSelectedLane(lane.id)}
                className={`relative overflow-hidden p-6 rounded-2xl border text-left transition-all ${
                  lane.status === 'booked' 
                    ? 'opacity-50 cursor-not-allowed border-white/5 bg-warm-card/20' 
                    : selectedLane === lane.id
                      ? 'border-brand-neonBlue bg-brand-neonBlue/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : 'border-white/10 bg-warm-card hover:border-white/20 hover:bg-warm-card/85'
                }`}
              >
                {lane.type === 'VIP' && (
                  <div className="absolute top-0 right-0 bg-brand-gold text-dark-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                    <Star className="w-3 h-3" /> VIP
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-1">L{lane.id}</h3>
                <div className="flex items-center gap-2 mt-4">
                  <div className={`w-2 h-2 rounded-full ${lane.status === 'booked' ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`} />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">{lane.status}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {selectedLane && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-0 left-0 right-0 p-6 glass-light border-t border-white/5 z-50">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => { alert('Bowling lane reservation confirmed! (Simulation)'); navigate('/menu'); }}
              className="w-full py-4 rounded-xl bg-brand-neonPurple hover:bg-brand-neonBlue text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookLane;
