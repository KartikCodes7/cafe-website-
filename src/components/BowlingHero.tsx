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
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playRollSound = () => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 1.2);
      
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
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

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 240;

    const particles: SparkParticle[] = [];
    const colors = ['#FFE082', '#FFB300', '#FFD54F', '#FFA500', '#FFFFFF', '#D97706'];

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
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

  // Launch roll action (Curved Loop strike from top-right logo ball)
  const launchBall = async () => {
    if (isRolling || isStriking) return;
    setIsRolling(true);
    playRollSound();

    // Mathematically perfect loop sequence:
    // 1. Starts above BOWLING (x=0, y=0, scale=1)
    // 2. Loops left and down to foreground (x=-145, y=100, scale=1.4)
    // 3. Rolls center foreground (x=-18, y=196, scale=1.8)
    // 4. Glides straight up the lane in 3D perspective to strike the pins (x=-108, y=114, scale=0.7)
    await ballControls.start({
      x: [0, -145, -18, -108],
      y: [0, 95, 196, 114],
      scale: [1.0, 1.4, 1.8, 0.7],
      rotate: [0, -360, -720, 360],
      transition: { 
        duration: 1.35, 
        times: [0, 0.35, 0.65, 1.0], 
        ease: ["easeOut", "easeIn", "easeOut"] 
      }
    });

    // 2. Collision Impact at pins (x=160, y=138 in SVG space)
    setIsStriking(true);
    setShowStrikeText(true);
    playStrikeSound();

    // Map SVG coordinates (160, 138) to canvas coordinates
    const containerWidth = canvasRef.current?.parentElement?.clientWidth || 600;
    const containerHeight = canvasRef.current?.parentElement?.clientHeight || 240;
    const canvasX = (160 / 500) * containerWidth;
    const canvasY = (138 / 240) * containerHeight;
    triggerSparks(canvasX, canvasY);

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
      setShowStrikeText(false);
      setIsStriking(false);
      
      setTimeout(async () => {
        setIsRolling(false);
        ballControls.set({ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 });
      }, 500);

    }, 3800);
  };

  // Capture swipe up anywhere on the banner
  const handleSwipeEnd = (_event: any, info: any) => {
    if (info.velocity.y < -150 || info.offset.y < -30) {
      launchBall();
    }
  };

  return (
    <motion.section 
      animate={heroControls}
      className="relative mt-8 mb-10 rounded-3xl overflow-hidden border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] h-56 sm:h-64 flex flex-col justify-end p-6 select-none bg-black"
      style={{ touchAction: 'none' }} // Prevent scrolling while dragging
      onClick={initAudio}
    >
      {/* 3D Wood Grain Lane Gradient and Lanes Lines */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 500 240">
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
          <polygon points="180,80 320,80 480,240 20,240" fill="url(#woodGradient)" />
          
          {/* Wood Board Perspective Planks */}
          <line x1="200" y1="80" x2="60" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="220" y1="80" x2="140" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="240" y1="80" x2="220" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="250" y1="80" x2="250" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.25" />
          <line x1="260" y1="80" x2="280" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="280" y1="80" x2="360" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />
          <line x1="300" y1="80" x2="440" y2="240" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.15" />

          {/* Perspective Gutter Lines */}
          <line x1="180" y1="80" x2="20" y2="240" stroke="#f59e0b" strokeWidth="2.5" strokeOpacity="0.4" />
          <line x1="320" y1="80" x2="480" y2="240" stroke="#f59e0b" strokeWidth="2.5" strokeOpacity="0.4" />
          
          {/* Spotlight Cone */}
          <polygon points="210,0 290,0 480,240 20,240" fill="url(#lightBeam)" pointerEvents="none" />
        </svg>

        {/* Dynamic ambient spotlight flare */}
        <div className="absolute top-[-10%] left-[35%] right-[35%] h-[60%] rounded-full bg-brand-neonBlue/15 blur-[65px]" />
      </div>

      {/* Embedded canvas for high-performance spark particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Unified Vector composition (Wood lane + 3D Gold Logo + Dynamic Pins + Dynamic Ball) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        
        {/* SVG Gold Logo and bowling graphics */}
        <svg className="w-full max-w-[500px] h-[240px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]" viewBox="0 0 500 240">
          <defs>
            <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="25%" stopColor="#E2A63B" />
              <stop offset="50%" stopColor="#FAD36E" />
              <stop offset="75%" stopColor="#B37C1B" />
              <stop offset="100%" stopColor="#FFF4D0" />
            </linearGradient>

            <filter id="goldBevel" x="-10%" y="-10%" width="120%" height="120%">
              <feOffset result="offOut" in="SourceAlpha" dx="1.5" dy="3.5" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1.5" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>

          {/* Logo script "The" */}
          <text x="125" y="42" fontFamily="'Playball', cursive" fontSize="30" fill="url(#goldText)" filter="url(#goldBevel)">The</text>

          {/* THREE decorative gold balls above BOWLING with speed lines */}
          <g filter="url(#goldBevel)">
            {/* Ball 3 (smallest, rightmost) */}
            <circle cx="332" cy="38" r="9" fill="url(#goldText)" />
            <circle cx="329" cy="35" r="0.8" fill="#000" />
            <circle cx="332" cy="35" r="0.8" fill="#000" />
            <circle cx="330" cy="39" r="0.8" fill="#000" />
            <path d="M322,42 C302,40 316,32 298,38" fill="none" stroke="url(#goldText)" strokeWidth="0.8" opacity="0.65" />

            {/* Ball 2 (medium, middle) */}
            <circle cx="302" cy="32" r="11" fill="url(#goldText)" />
            <circle cx="298" cy="28" r="1" fill="#000" />
            <circle cx="302" cy="28" r="1" fill="#000" />
            <circle cx="300" cy="33" r="1" fill="#000" />
            <path d="M290,36 C270,34 284,26 266,32" fill="none" stroke="url(#goldText)" strokeWidth="0.9" opacity="0.75" />

            {/* Ball 1 (leftmost, largest) - Hides when rolling (replaced by motion.g) */}
            {!isRolling && (
              <g>
                <circle cx="268" cy="24" r="14" fill="url(#goldText)" />
                <circle cx="264" cy="20" r="1.3" fill="#000" />
                <circle cx="269" cy="20" r="1.3" fill="#000" />
                <circle cx="266" cy="25" r="1.3" fill="#000" />
              </g>
            )}
            <path d="M250,28 C226,24 242,14 220,22" fill="none" stroke="url(#goldText)" strokeWidth="1.0" opacity="0.85" />
          </g>

          {/* Draggable/Rollable ball element animated inside the vector layout */}
          {isRolling && (
            <motion.g
              animate={ballControls}
              transform="translate(268, 24)"
              filter="url(#goldBevel)"
            >
              {/* Ball sphere */}
              <circle cx="0" cy="0" r="14" fill="url(#goldText)" />
              {/* Finger holes */}
              <circle cx="-4" cy="-4" r="1.3" fill="#000" />
              <circle cx="1" cy="-4" r="1.3" fill="#000" />
              <circle cx="-2" cy="1" r="1.3" fill="#000" />
            </motion.g>
          )}

          {/* Massive "BOWLING" Header (positioned above pins deck) */}
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

          {/* Embossed "TOWN" Header (positioned below/right) */}
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

          {/* DYNAMIC SHIFTED BOWLING PINS: Shifted downwards at y=138 to free "BO" in "BOWLING" */}
          <g filter="url(#goldBevel)">
            
            {/* Animated Left Pin (starts at x=146, y=138) */}
            <motion.g
              transform="translate(146, 138)"
              animate={isStriking ? {
                x: -160,
                y: -40,
                rotate: -270,
                scale: 0.1,
                opacity: 0,
                transition: { duration: 0.65, ease: [0.175, 0.885, 0.32, 1.1] }
              } : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
              className="origin-bottom"
            >
              {/* Shape of bowling pin */}
              <path d="M0,-37 C1.5,-37 2,-35 1.5,-32 C1.5,-31 2.5,-29 3,-27 C3.5,-24 3.5,-21 3,-19 C2.5,-18 1.5,-18 0,-18 C-1.5,-18 -2.5,-18 -3,-19 C-3.5,-21 -3.5,-24 -3,-27 C-2.5,-29 -1.5,-31 -1.5,-32 C-2,-35 -1.5,-37 0,-37 Z" fill="url(#goldText)" />
              {/* Collar bands */}
              <rect x="-1" y="-33" width="2" height="1.2" fill="#582a02" />
              <rect x="-1.2" y="-31" width="2.4" height="1.2" fill="#582a02" />
            </motion.g>

            {/* Animated Center Pin (starts at x=160, y=135) */}
            <motion.g
              transform="translate(160, 135)"
              animate={isStriking ? {
                y: -110,
                x: -10,
                rotate: 360,
                scale: 0.1,
                opacity: 0,
                transition: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.1] }
              } : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
              className="origin-bottom"
            >
              <path d="M0,-37 C1.5,-37 2,-35 1.5,-32 C1.5,-31 2.5,-29 3,-27 C3.5,-24 3.5,-21 3,-19 C2.5,-18 1.5,-18 0,-18 C-1.5,-18 -2.5,-18 -3,-19 C-3.5,-21 -3.5,-24 -3,-27 C-2.5,-29 -1.5,-31 -1.5,-32 C-2,-35 -1.5,-37 0,-37 Z" fill="url(#goldText)" />
              <rect x="-1" y="-33" width="2" height="1.2" fill="#582a02" />
              <rect x="-1.2" y="-31" width="2.4" height="1.2" fill="#582a02" />
            </motion.g>

            {/* Animated Right Pin (starts at x=174, y=138) */}
            <motion.g
              transform="translate(174, 138)"
              animate={isStriking ? {
                x: 160,
                y: -40,
                rotate: 270,
                scale: 0.1,
                opacity: 0,
                transition: { duration: 0.65, ease: [0.175, 0.885, 0.32, 1.1] }
              } : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
              className="origin-bottom"
            >
              <path d="M0,-37 C1.5,-37 2,-35 1.5,-32 C1.5,-31 2.5,-29 3,-27 C3.5,-24 3.5,-21 3,-19 C2.5,-18 1.5,-18 0,-18 C-1.5,-18 -2.5,-18 -3,-19 C-3.5,-21 -3.5,-24 -3,-27 C-2.5,-29 -1.5,-31 -1.5,-32 C-2,-35 -1.5,-37 0,-37 Z" fill="url(#goldText)" />
              <rect x="-1" y="-33" width="2" height="1.2" fill="#582a02" />
              <rect x="-1.2" y="-31" width="2.4" height="1.2" fill="#582a02" />
            </motion.g>

          </g>
        </svg>
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
              Epic Curved Release 🎳
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text tooltip at bottom */}
      {!isRolling && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
          <motion.span 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="text-[9px] font-mono tracking-[0.25em] text-brand-neonBlue/60 uppercase font-black"
          >
            Swipe Up Anywhere to Strike!
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

      {/* GESTURE DETECTOR OVERLAY: Swiping upwards ANYWHERE inside the banner triggers the roll */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={handleSwipeEnd}
        className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
      />

    </motion.section>
  );
};

export default BowlingHero;
