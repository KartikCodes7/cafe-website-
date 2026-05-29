import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Particle definition for the Canvas explosion
interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

const BowlingHero = () => {
  const [isStriking, setIsStriking] = useState(false);
  const [showStrikeText, setShowStrikeText] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Controls for ball motion and camera shake
  const ballControls = useAnimation();
  const heroControls = useAnimation();

  // Load elegant fonts for logo dynamically on mount
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playball&family=Outfit:wght@800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Web Audio Synthesizer for high-end rolling & strike impact sound effects
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    // Resume context if suspended (browser security)
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playRollSound = () => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // Low frequency rumble for rolling ball
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      // Frequency ramps up slightly as it gets closer
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.8);
      
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  const playStrikeSound = () => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // 1. Deep impact thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(80, ctx.currentTime);
      thudOsc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.6);
      thudGain.gain.setValueAtTime(0.3, ctx.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start();
      thudOsc.stop(ctx.currentTime + 0.6);

      // 2. High-pitched pin shattering crash (White Noise + Bandpass Filter sweep)
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filterNode = ctx.createBiquadFilter();
      filterNode.type = 'bandpass';
      filterNode.frequency.setValueAtTime(1200, ctx.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
      filterNode.Q.setValueAtTime(3, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      noiseNode.connect(filterNode);
      filterNode.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseNode.start();
      noiseNode.stop(ctx.currentTime + 0.8);

      // 3. Metallic resonating wood ring out
      const ringOsc = ctx.createOscillator();
      const ringGain = ctx.createGain();
      ringOsc.type = 'triangle';
      ringOsc.frequency.setValueAtTime(440, ctx.currentTime);
      ringOsc.frequency.setValueAtTime(330, ctx.currentTime + 0.1);
      ringGain.gain.setValueAtTime(0.05, ctx.currentTime);
      ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      ringOsc.connect(ringGain);
      ringGain.connect(ctx.destination);
      ringOsc.start();
      ringOsc.stop(ctx.currentTime + 1.2);
      
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  // Spark Particle canvas generator
  const triggerSparks = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions if not set
    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 200;

    const particles: SparkParticle[] = [];
    const colors = ['#FFE082', '#FFB300', '#FFD54F', '#FFA500', '#FFFFFF', '#D97706'];

    // Generate 45 sparkling golden particles bursting outward
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // burst slightly upward
        radius: Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        gravity: 0.12,
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;

        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        // Glow effect
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        activeParticles++;
      });

      if (activeParticles > 0) {
        requestAnimationFrame(animateParticles);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animateParticles();
  };

  // Launch roll action
  const launchBall = async () => {
    if (isRolling || isStriking) return;
    setIsRolling(true);
    playRollSound();

    // 1. Smooth glide up the lane
    // Coordinates match exactly the target pins deck location: center top
    await ballControls.start({
      y: -110,
      x: -45, // Direct hit under "BOWL" pins
      scale: 0.35,
      rotate: 720,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    });

    // 2. Collision Impact
    setIsStriking(true);
    setShowStrikeText(true);
    playStrikeSound();

    // Canvas Sparks at the impact site (approx center/top coordinate)
    const containerWidth = canvasRef.current?.parentElement?.clientWidth || 600;
    const impactX = containerWidth / 2 - 45; // Alignment with pins
    triggerSparks(impactX, 55);

    // Camera Shake
    await heroControls.start({
      y: [0, -6, 6, -3, 3, 0],
      x: [0, 4, -4, 2, -2, 0],
      transition: { duration: 0.35, ease: "easeInOut" }
    });

    // Hide ball on impact
    ballControls.set({ opacity: 0 });

    // 3. Smooth Reset sequence
    setTimeout(async () => {
      // Fade out banner and text
      setShowStrikeText(false);
      
      // Reset pins
      setIsStriking(false);
      
      // Wait for pins to return, then slide the ball back in
      setTimeout(async () => {
        setIsRolling(false);
        ballControls.set({ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 });
      }, 500);

    }, 3800);
  };

  // Handle Drag gesture end
  const handleDragEnd = (_event: any, info: any) => {
    // Check if flicked upwards with sufficient speed or distance
    if (info.velocity.y < -250 || info.offset.y < -50) {
      launchBall();
    } else {
      // Spring back to starting spot
      ballControls.start({ x: 0, y: 0, scale: 1, rotate: 0 });
    }
  };

  return (
    <motion.section 
      animate={heroControls}
      className="relative mt-8 mb-10 rounded-3xl overflow-hidden border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] h-56 sm:h-64 flex flex-col justify-end p-6 select-none bg-black"
      style={{ touchAction: 'none' }} // Prevent scrolling while dragging
      onClick={initAudio} // Initialize audio context on first click
    >
      {/* 3D Wood Grain Lane Gradient and Lanes Lines */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black overflow-hidden">
        {/* Rich perspective wooden lane */}
        <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 600 240">
          <defs>
            <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#451e06" />
              <stop offset="50%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#2c1102" />
            </linearGradient>
            
            <linearGradient id="lightBeam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Main Trapezoidal Bowling Lane */}
          <polygon points="220,40 380,40 540,240 60,240" fill="url(#woodGradient)" />
          
          {/* Wood Board Perspective Planks */}
          <line x1="240" y1="40" x2="120" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="260" y1="40" x2="180" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="280" y1="40" x2="240" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="300" y1="40" x2="300" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.25" />
          <line x1="320" y1="40" x2="360" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="340" y1="40" x2="420" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="360" y1="40" x2="480" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />

          {/* Perspective Gutter Lines */}
          <line x1="220" y1="40" x2="60" y2="240" stroke="#f59e0b" strokeWidth="2.5" strokeOpacity="0.4" />
          <line x1="380" y1="40" x2="540" y2="240" stroke="#f59e0b" strokeWidth="2.5" strokeOpacity="0.4" />
          
          {/* Spotlight Cone */}
          <polygon points="260,0 340,0 480,240 120,240" fill="url(#lightBeam)" pointerEvents="none" />
        </svg>

        {/* Dynamic ambient spotlight flare */}
        <div className="absolute top-[-10%] left-[35%] right-[35%] h-[60%] rounded-full bg-brand-neonBlue/15 blur-[65px] pointer-events-none" />
      </div>

      {/* Embedded canvas for high-performance spark particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Golden EMBOSSED Logo & Standing/Animated Pins */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        
        {/* SVG Gold Logo Branding */}
        <svg className="w-full max-w-[500px] h-[160px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" viewBox="0 0 500 160">
          <defs>
            {/* High-quality metallic gold gradient */}
            <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="25%" stopColor="#E2A63B" />
              <stop offset="50%" stopColor="#FAD36E" />
              <stop offset="75%" stopColor="#B37C1B" />
              <stop offset="100%" stopColor="#FFF4D0" />
            </linearGradient>

            {/* Embossed metallic bevel style filter */}
            <filter id="goldBevel" x="-10%" y="-10%" width="120%" height="120%">
              <feOffset result="offOut" in="SourceAlpha" dx="1.5" dy="3.5" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1.5" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>

          {/* Cursive "The" */}
          <text 
            x="125" 
            y="42" 
            fontFamily="'Playball', cursive font-style-italic" 
            fontSize="30" 
            fill="url(#goldText)" 
            filter="url(#goldBevel)"
          >
            The
          </text>

          {/* Rolling decorative balls in logo on the right */}
          <g filter="url(#goldBevel)">
            {/* Ball 1 */}
            <circle cx="282" cy="24" r="16" fill="url(#goldText)" />
            {/* 3 finger holes */}
            <circle cx="277" cy="18" r="1.5" fill="#000" />
            {/* Speed trails */}
            <circle cx="282" cy="18" r="1.5" fill="#000" />
            <circle cx="279" cy="25" r="1.5" fill="#000" />
            <path d="M260,32 C230,28 250,15 220,25" fill="none" stroke="url(#goldText)" strokeWidth="0.85" opacity="0.75" />
            <path d="M260,28 C238,20 252,10 226,18" fill="none" stroke="url(#goldText)" strokeWidth="0.85" opacity="0.6" />

            {/* Ball 2 */}
            <circle cx="338" cy="40" r="12" fill="url(#goldText)" />
            <circle cx="334" cy="36" r="1" fill="#000" />
            <circle cx="338" cy="36" r="1" fill="#000" />
            <circle cx="336" cy="41" r="1" fill="#000" />
            <path d="M322,46 C302,44 316,36 298,42" fill="none" stroke="url(#goldText)" strokeWidth="0.8" opacity="0.65" />
          </g>

          {/* Massive "BOWLING" Header */}
          <text 
            x="125" 
            y="94" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="54" 
            letterSpacing="3" 
            fill="url(#goldText)" 
            filter="url(#goldBevel)"
          >
            BOWLING
          </text>

          {/* Embossed "TOWN" Header (positioned below/right of BOWLING) */}
          <text 
            x="248" 
            y="136" 
            fontFamily="'Outfit', sans-serif" 
            fontWeight="900" 
            fontSize="40" 
            letterSpacing="3.5" 
            fill="url(#goldText)" 
            filter="url(#goldBevel)"
          >
            TOWN
          </text>
        </svg>

        {/* Premium Interactive Standing Pins: Positioned exactly under "BOWL" of "BOWLING" */}
        <div className="absolute top-[82px] left-[50%] -translate-x-[90px] w-20 h-16 flex items-end justify-center z-10">
          
          {/* Animated Left Pin */}
          <motion.div 
            animate={isStriking ? {
              x: -140,
              y: -50,
              rotate: -280,
              scale: 0.1,
              opacity: 0,
              transition: { duration: 0.65, ease: [0.175, 0.885, 0.32, 1.1] }
            } : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            className="w-4.5 h-11 relative select-none origin-bottom mr-[-3px]"
          >
            <svg viewBox="0 0 16 38" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]">
              <path d="M8,1 C11,1 12,5 11,10 C11,12 13,15 14,20 C15,25 15,31 14,35 C13,37 11,37 8,37 C5,37 3,37 2,35 C1,31 1,25 2,20 C3,15 5,12 5,10 C4,5 5,1 C8,1 Z" fill="url(#goldText)" />
              {/* Gold decorative collar bands */}
              <rect x="5.5" y="8" width="5" height="1.8" fill="#582a02" />
              <rect x="5" y="11.2" width="6" height="1.8" fill="#582a02" />
            </svg>
          </motion.div>

          {/* Animated Center Pin (positioned slightly in front) */}
          <motion.div 
            animate={isStriking ? {
              y: -110,
              rotate: 390,
              scale: 0.1,
              opacity: 0,
              transition: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.1] }
            } : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            className="w-4.5 h-11 relative select-none origin-bottom z-10"
          >
            <svg viewBox="0 0 16 38" className="w-full h-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]">
              <path d="M8,1 C11,1 12,5 11,10 C11,12 13,15 14,20 C15,25 15,31 14,35 C13,37 11,37 8,37 C5,37 3,37 2,35 C1,31 1,25 2,20 C3,15 5,12 5,10 C4,5 5,1 C8,1 Z" fill="url(#goldText)" />
              <rect x="5.5" y="8" width="5" height="1.8" fill="#582a02" />
              <rect x="5" y="11.2" width="6" height="1.8" fill="#582a02" />
            </svg>
          </motion.div>

          {/* Animated Right Pin */}
          <motion.div 
            animate={isStriking ? {
              x: 140,
              y: -50,
              rotate: 280,
              scale: 0.1,
              opacity: 0,
              transition: { duration: 0.65, ease: [0.175, 0.885, 0.32, 1.1] }
            } : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            className="w-4.5 h-11 relative select-none origin-bottom ml-[-3px]"
          >
            <svg viewBox="0 0 16 38" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]">
              <path d="M8,1 C11,1 12,5 11,10 C11,12 13,15 14,20 C15,25 15,31 14,35 C13,37 11,37 8,37 C5,37 3,37 2,35 C1,31 1,25 2,20 C3,15 5,12 5,10 C4,5 5,1 C8,1 Z" fill="url(#goldText)" />
              <rect x="5.5" y="8" width="5" height="1.8" fill="#582a02" />
              <rect x="5" y="11.2" width="6" height="1.8" fill="#582a02" />
            </svg>
          </motion.div>

        </div>
      </div>

      {/* Flashing Holographic STRIKE! Announcement Overlay */}
      <AnimatePresence>
        {showStrikeText && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.25, rotate: -10 }}
            animate={{ opacity: 1, scale: 1.25, rotate: 0 }}
            exit={{ opacity: 0, scale: 2.0, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 220, damping: 10 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-brand-gold font-display uppercase tracking-widest drop-shadow-[0_0_20px_rgba(255,215,0,0.85)] animate-pulse">
              STRIKE!
            </h2>
            <span className="text-[10px] font-mono tracking-[0.4em] text-white/70 uppercase mt-2">
              Flawless Delivery 🎳
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text tooltip at bottom */}
      {!isRolling && (
        <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
          <motion.span 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="text-[9px] font-mono tracking-[0.25em] text-brand-neonBlue/60 uppercase font-black"
          >
            Swipe Up to Strike!
          </motion.span>
          <motion.div 
            animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-brand-neonBlue text-[11px] mt-0.5"
          >
            ▲
          </motion.div>
        </div>
      )}

      {/* Draggable Polished Metallic Bowling Ball */}
      <div className="absolute bottom-2 left-0 right-0 z-30 flex justify-center">
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, bottom: 0, top: 0 }}
          dragElastic={0.65}
          onDragEnd={handleDragEnd}
          animate={ballControls}
          whileDrag={{ scale: 1.08, cursor: 'grabbing' }}
          className="w-13 h-13 rounded-full cursor-grab relative flex items-center justify-center select-none"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #FFF4D0 0%, #D97706 45%, #582a02 90%)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.7), inset -4px -4px 10px rgba(0,0,0,0.8), inset 4px 4px 10px rgba(255,255,255,0.4)',
          }}
        >
          {/* Finger holes */}
          <div className="w-1.5 h-1.5 rounded-full bg-black/90 absolute top-[30%] left-[36%] border-b border-r border-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/90 absolute top-[30%] left-[54%] border-b border-r border-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/90 absolute top-[48%] left-[45%] border-b border-r border-white/20" />
          
          {/* Beautiful glossy highlight */}
          <div className="absolute top-[8%] left-[18%] w-[45%] h-[20%] rounded-full bg-white/25 rotate-[-30deg] blur-[0.8px] pointer-events-none" />
        </motion.div>
      </div>

    </motion.section>
  );
};

export default BowlingHero;
