import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';

const Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col text-white">
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5 pt-12 pb-4 px-6 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Analytics</h1>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-brand-neonBlue/10 flex items-center justify-center mb-6">
          <TrendingUp className="w-12 h-12 text-brand-neonBlue" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Revenue Insights</h2>
        <p className="text-gray-400 max-w-sm text-center">
          Analytics module is protected. Connect a backend provider to view historical revenue and lane utilization metrics.
        </p>
      </main>
    </div>
  );
};

export default Analytics;
