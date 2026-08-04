'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, ChevronRight } from 'lucide-react';

interface CoffeeLoaderProps {
  onComplete: () => void;
}

export default function CoffeeLoader({ onComplete }: CoffeeLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<number>(1); // 1: Beans falling, 2: Grinding, 3: Cup fills, 4: Website opens
  const [progress, setProgress] = useState<number>(0);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime: number | null = null;
    const DURATION = 5200; // Total 5.2 seconds sequence

    // 1. Falling Beans setup
    interface Bean {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rot: number;
      vRot: number;
    }
    const beans: Bean[] = [];
    for (let i = 0; i < 28; i++) {
      beans.push({
        x: (Math.random() - 0.5) * 160,
        y: -100 - Math.random() * 250,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 3 + Math.random() * 3,
        size: 10 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1,
      });
    }

    // 2. Grinding Particles setup
    interface Ground {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }
    const grounds: Ground[] = [];

    // 3. Steam Particles setup
    interface Steam {
      x: number;
      y: number;
      vy: number;
      size: number;
      alpha: number;
    }
    const steams: Steam[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const pct = Math.min(1, elapsed / DURATION);
      setProgress(pct);

      // Phase determination
      let currentPhase = 1;
      if (pct > 0.32 && pct <= 0.65) currentPhase = 2;
      else if (pct > 0.65 && pct <= 0.92) currentPhase = 3;
      else if (pct > 0.92) currentPhase = 4;

      setPhase(currentPhase);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 20;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep Dark Espresso Canvas Background
      const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(canvas.width, canvas.height) * 0.7);
      bgGrad.addColorStop(0, '#2D1810');
      bgGrad.addColorStop(0.6, '#180E09');
      bgGrad.addColorStop(1, '#0C0604');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- PHASE 1: BEANS FALLING INTO GRINDER ---
      if (pct <= 0.38) {
        // Draw Grinder Hopper Funnel
        ctx.save();
        ctx.translate(cx, cy - 40);

        // Hopper Glass Cone
        ctx.beginPath();
        ctx.moveTo(-70, -110);
        ctx.lineTo(70, -110);
        ctx.lineTo(25, -20);
        ctx.lineTo(-25, -20);
        ctx.closePath();

        const glassGrad = ctx.createLinearGradient(-70, 0, 70, 0);
        glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
        glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.18)');
        glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.04)');
        ctx.fillStyle = glassGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(212, 165, 116, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Render Tumbling Beans
        for (const b of beans) {
          b.y += b.vy;
          b.x += b.vx;
          b.rot += b.vRot;

          // Funnel constraint
          if (b.y > -20) {
            b.y = -100 - Math.random() * 200;
            b.x = (Math.random() - 0.5) * 120;
          }

          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, b.size, b.size * 0.6, 0, 0, Math.PI * 2);
          const bGrad = ctx.createLinearGradient(-b.size, 0, b.size, 0);
          bGrad.addColorStop(0, '#5C3622');
          bGrad.addColorStop(0.5, '#3A1E11');
          bGrad.addColorStop(1, '#1A0C06');
          ctx.fillStyle = bGrad;
          ctx.fill();

          // Crease line
          ctx.beginPath();
          ctx.moveTo(-b.size * 0.7, 0);
          ctx.lineTo(b.size * 0.7, 0);
          ctx.strokeStyle = '#0E0502';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      }

      // --- PHASE 2: GRINDING (Vibration & Ground Coffee Shower) ---
      if (pct > 0.28 && pct <= 0.72) {
        ctx.save();
        const vibrateX = Math.sin(now * 0.08) * 3;
        ctx.translate(cx + vibrateX, cy - 40);

        // Metallic Grinder Body
        ctx.beginPath();
        ctx.roundRect(-45, -20, 90, 80, 8);
        const metalGrad = ctx.createLinearGradient(-45, 0, 45, 0);
        metalGrad.addColorStop(0, '#2A1C15');
        metalGrad.addColorStop(0.3, '#5C4033');
        metalGrad.addColorStop(0.7, '#422B20');
        metalGrad.addColorStop(1, '#1C110B');
        ctx.fillStyle = metalGrad;
        ctx.fill();
        ctx.strokeStyle = '#7A5845';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Spout nozzle
        ctx.fillStyle = '#1A0F0A';
        ctx.fillRect(-12, 60, 24, 15);

        ctx.restore();

        // Spawn Ground Particles
        if (pct > 0.32 && pct < 0.68) {
          for (let g = 0; g < 4; g++) {
            grounds.push({
              x: cx + (Math.random() - 0.5) * 16,
              y: cy + 35,
              vx: (Math.random() - 0.5) * 2,
              vy: 4 + Math.random() * 4,
              size: 1.5 + Math.random() * 2,
              alpha: 1,
            });
          }
        }

        // Draw Grounds Shower
        for (let i = grounds.length - 1; i >= 0; i--) {
          const gr = grounds[i];
          gr.x += gr.vx;
          gr.y += gr.vy;
          gr.alpha -= 0.015;

          if (gr.alpha <= 0) {
            grounds.splice(i, 1);
          } else {
            ctx.beginPath();
            ctx.arc(gr.x, gr.y, gr.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 120, 70, ${gr.alpha})`;
            ctx.fill();
          }
        }
      }

      // --- PHASE 3: CUP FILLS ---
      if (pct > 0.58) {
        ctx.save();
        ctx.translate(cx, cy + 60);

        const cupWidth = 110;
        const cupHeight = 85;
        const fillLevel = Math.max(0, Math.min(1, (pct - 0.60) / 0.32));

        // Saucer
        ctx.beginPath();
        ctx.ellipse(0, cupHeight / 2 + 10, cupWidth * 0.75, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#3A261C';
        ctx.fill();
        ctx.strokeStyle = '#6E4D3E';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Cup Body
        ctx.beginPath();
        ctx.ellipse(0, -cupHeight / 2, cupWidth / 2, 14, 0, Math.PI, 0, true);
        ctx.bezierCurveTo(cupWidth / 2, 0, cupWidth * 0.4, cupHeight / 2, cupWidth * 0.35, cupHeight / 2);
        ctx.ellipse(0, cupHeight / 2, cupWidth * 0.35, 10, 0, 0, Math.PI, false);
        ctx.bezierCurveTo(-cupWidth * 0.4, cupHeight / 2, -cupWidth / 2, 0, -cupWidth / 2, -cupHeight / 2);
        ctx.closePath();

        const cupGrad = ctx.createLinearGradient(-cupWidth / 2, 0, cupWidth / 2, 0);
        cupGrad.addColorStop(0, '#1F120B');
        cupGrad.addColorStop(0.3, '#4A3225');
        cupGrad.addColorStop(0.7, '#3A2419');
        cupGrad.addColorStop(1, '#150A05');
        ctx.fillStyle = cupGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(212, 165, 116, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Handle
        ctx.beginPath();
        ctx.arc(cupWidth * 0.52, -5, 18, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#3A261C';
        ctx.stroke();

        // Liquid Rising
        if (fillLevel > 0) {
          ctx.save();
          const liquidY = (cupHeight / 2 - 8) - fillLevel * (cupHeight - 20);
          const liquidW = (cupWidth / 2 - 4) * (0.7 + 0.3 * fillLevel);

          ctx.beginPath();
          ctx.ellipse(0, liquidY, liquidW, 10 * (0.7 + 0.3 * fillLevel), 0, 0, Math.PI * 2);
          const surfaceGrad = ctx.createRadialGradient(0, liquidY, 0, 0, liquidY, liquidW);
          surfaceGrad.addColorStop(0, '#D4A574'); // Crema center
          surfaceGrad.addColorStop(0.6, '#5C331E');
          surfaceGrad.addColorStop(1, '#2E170C');
          ctx.fillStyle = surfaceGrad;
          ctx.fill();
          ctx.restore();
        }

        // Pour Stream from top
        if (fillLevel > 0.05 && fillLevel < 0.98) {
          ctx.beginPath();
          ctx.moveTo(-2, -cupHeight - 30);
          ctx.lineTo(2, -cupHeight - 30);
          ctx.lineTo(1, (cupHeight / 2 - 8) - fillLevel * (cupHeight - 20));
          ctx.lineTo(-1, (cupHeight / 2 - 8) - fillLevel * (cupHeight - 20));
          ctx.closePath();
          const streamGrad = ctx.createLinearGradient(0, -cupHeight - 30, 0, 0);
          streamGrad.addColorStop(0, '#5C3119');
          streamGrad.addColorStop(1, '#3B1E0F');
          ctx.fillStyle = streamGrad;
          ctx.fill();
        }

        ctx.restore();

        // Spawn Steam
        if (fillLevel > 0.3 && Math.random() < 0.4) {
          steams.push({
            x: cx + (Math.random() - 0.5) * 40,
            y: cy + 30,
            vy: -1.2 - Math.random() * 1.5,
            size: 8 + Math.random() * 8,
            alpha: 0.3,
          });
        }

        // Draw Steam
        for (let s = steams.length - 1; s >= 0; s--) {
          const st = steams[s];
          st.y += st.vy;
          st.size += 0.3;
          st.alpha -= 0.008;

          if (st.alpha <= 0) {
            steams.splice(s, 1);
          } else {
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 230, 211, ${st.alpha})`;
            ctx.fill();
          }
        }
      }

      if (elapsed < DURATION) {
        animId = requestAnimationFrame(render);
      } else {
        setIsClosing(true);
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsClosing(true);
    setTimeout(onComplete, 400);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 1:
        return 'Beans falling into grinder...';
      case 2:
        return 'Grinding fresh roast...';
      case 3:
        return 'Filling espresso cup...';
      case 4:
        return 'Enjoy BREWHAUS!';
      default:
        return 'Preparing Coffee...';
    }
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-between select-none overflow-hidden bg-[#0C0604]"
        >
          {/* Canvas Background & Animation */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

          {/* Top Brand Logo Header */}
          <div className="relative z-10 pt-10 text-center">
            <span className="text-xs font-extrabold tracking-[0.3em] uppercase text-[var(--coffee-accent)] font-inter block mb-1">
              BREWHAUS · EST. 2014
            </span>
            <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-[#F5E6D3] tracking-wide">
              Crafting Excellence
            </h1>
          </div>

          {/* Bottom Phase Text & Progress Bar */}
          <div className="relative z-10 pb-12 px-6 w-full max-w-md flex flex-col items-center gap-4">
            {/* Dynamic Phase Text */}
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-sm md:text-base font-semibold font-inter text-[#F5E6D3]"
            >
              <Coffee className="w-4 h-4 text-[var(--coffee-accent)] animate-pulse" />
              <span>{getPhaseText()}</span>
            </motion.div>

            {/* Glowing Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#2A1810] border border-[#5A4034]/40 overflow-hidden relative p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--coffee-accent)] via-[#D4A574] to-[var(--coffee-gold)]"
                style={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Stage Indicator Pills */}
            <div className="flex items-center justify-between w-full text-[10px] font-bold tracking-wider uppercase font-inter text-[var(--coffee-text-secondary)] px-1">
              <span className={phase >= 1 ? 'text-[var(--coffee-accent)]' : ''}>1. Beans</span>
              <span>↓</span>
              <span className={phase >= 2 ? 'text-[var(--coffee-accent)]' : ''}>2. Grinding</span>
              <span>↓</span>
              <span className={phase >= 3 ? 'text-[var(--coffee-accent)]' : ''}>3. Cup Fills</span>
              <span>↓</span>
              <span className={phase >= 4 ? 'text-[var(--coffee-accent)]' : ''}>4. Open</span>
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="mt-2 text-xs text-[var(--coffee-text-secondary)] hover:text-white flex items-center gap-1 transition-colors font-inter opacity-70 hover:opacity-100"
            >
              <span>Skip Intro</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
