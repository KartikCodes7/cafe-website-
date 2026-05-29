import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const IntroLoader = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const setTable = useAppStore(state => state.setTable);
  const [telemetry, setTelemetry] = useState('INITIALIZING SECURE LINK...');
  const [progress, setProgress] = useState(0);

  // Parse table number: "table-4" → "Table 4"
  const formattedTable = id 
    ? id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    : 'Table 4';

  // Web Audio API Synthesizer for high-end UI sounds
  const playSynthesizedStrike = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(150, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.2);
      gain1.gain.setValueAtTime(0.05, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 1.2);

      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(80, ctx.currentTime);
        osc2.frequency.linearRampToValueAtTime(10, ctx.currentTime + 0.8);
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1000;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        osc2.start();
        noise.start();
        osc2.stop(ctx.currentTime + 0.8);
      }, 1500);

    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  };

  useEffect(() => {
    if (id) {
      setTable(formattedTable);
    } else {
      setTable('Table 4');
    }

    const telemetryTexts = [
      'ESTABLISHING ENCRYPTED CONNECTION...',
      'SCANNING TABLE TELEMETRY...',
      'SYNCING ENTERTAINMENT SYSTEMS...',
      'STRIKE PROTOCOL ACTIVE...',
      'CONNECTION ESTABLISHED!'
    ];

    let currentTextIndex = 0;
    const telemetryInterval = setInterval(() => {
      if (currentTextIndex < telemetryTexts.length - 1) {
        currentTextIndex++;
        setTelemetry(telemetryTexts[currentTextIndex]);
      }
    }, 450);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    playSynthesizedStrike();

    const tableNum = id ? id.replace('table-', '') : '4';
    const redirectTimer = setTimeout(() => {
      navigate(`/menu?table=${tableNum}`, { replace: true });
    }, 2600);

    return () => {
      clearInterval(telemetryInterval);
      clearInterval(progressInterval);
      clearTimeout(redirectTimer);
    };
  }, [id, navigate, setTable]);

  return (
    <div className="fixed inset-0 bg-warm-bg flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Immersive radial ambient light overlays */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-brand-neonBlue/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-brand-neonPurple/10 blur-[150px] pointer-events-none" />
      
      {/* Cinematic bowling background */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?auto=format&fit=crop&q=80')] bg-cover bg-center"
      />
      
      {/* Matte black cinematic vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-warm-bg via-warm-bg/60 to-warm-bg z-10" />

      {/* Main Experience Panel */}
      <div className="z-20 flex flex-col items-center px-8 w-full max-w-lg text-center">
        
        {/* Futuristic telemetry box */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 font-mono text-[10px] tracking-[0.2em] text-brand-neonBlue/40 border border-brand-neonBlue/10 px-4 py-1.5 rounded-full bg-warm-card/50 backdrop-blur-md"
        >
          {telemetry}
        </motion.div>

        {/* Cinematic Title Reveal */}
        <div className="mb-2 overflow-hidden">
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            THE BOWLING TOWN
          </motion.h1>
        </div>
        
        <div className="mb-8 overflow-hidden">
          <motion.h2
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg tracking-[0.5em] text-brand-neonPurple font-light uppercase"
          >
            & CAFE
          </motion.h2>
        </div>

        {/* Table Connection Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <div className="text-sm font-semibold tracking-widest text-white uppercase mb-1">
            {formattedTable} Connected 🎳
          </div>
          <p className="text-xs text-gray-500 font-mono tracking-widest">
            PORT // SECURE_NODE_0{formattedTable.slice(-1) || '4'}
          </p>
        </motion.div>

        {/* Glowing progress bar */}
        <div className="w-full max-w-[280px] flex flex-col items-center gap-3">
          <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-brand-neonPurple via-brand-neonBlue to-brand-neonBlue shadow-[0_0_12px_rgba(0,240,255,0.8)]"
            />
            <motion.div
              animate={{ left: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>
          
          <div className="flex justify-between w-full text-[10px] font-mono text-gray-500 tracking-wider">
            <span>UPTIME // MOCK_SYS</span>
            <span className="text-brand-neonBlue">{progress}%</span>
          </div>
        </div>
      </div>
      
      {/* Cinematic blur frames */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-warm-bg to-transparent z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-warm-bg to-transparent z-30 pointer-events-none" />
    </div>
  );
};

export default IntroLoader;
