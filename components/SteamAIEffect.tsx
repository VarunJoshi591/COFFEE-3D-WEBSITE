'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Sparkles, RefreshCw, Volume2, VolumeX, Cpu, Coffee, Heart, Code2, Award, User } from 'lucide-react';

export interface SteamAIEffectProps {
  className?: string;
  autoPlayDefault?: boolean;
  initialInitials?: string;
}

export interface ShapeDefinition {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  symbolText: string;
  fontStyle: string;
  colorPalette: string[];
  glowColor: string;
  type: 'emoji' | 'text' | 'tech';
}

const SHAPES: ShapeDefinition[] = [
  {
    id: 'cup',
    label: 'Coffee Cup',
    subtitle: 'Sensory Thermal Steam',
    icon: <Coffee className="w-4 h-4" />,
    symbolText: '☕',
    fontStyle: '90px "Segoe UI Emoji", "Apple Color Emoji", sans-serif',
    colorPalette: ['#F5E6D3', '#D4A574', '#FFF8DC', '#E6C280'],
    glowColor: 'rgba(212, 165, 116, 0.6)',
    type: 'emoji',
  },
  {
    id: 'heart',
    label: 'Heart',
    subtitle: 'Crafted with Passion',
    icon: <Heart className="w-4 h-4 text-pink-400" />,
    symbolText: '❤️',
    fontStyle: '90px "Segoe UI Emoji", "Apple Color Emoji", sans-serif',
    colorPalette: ['#FF2A6D', '#FF88A5', '#FFD1DC', '#FFF0F5'],
    glowColor: 'rgba(255, 42, 109, 0.7)',
    type: 'emoji',
  },
  {
    id: 'dev_logo',
    label: 'Developer Logo',
    subtitle: 'AI Code & Innovation',
    icon: <Code2 className="w-4 h-4 text-cyan-400" />,
    symbolText: '{ / }',
    fontStyle: 'bold 64px "Fira Code", "Courier New", monospace',
    colorPalette: ['#00F0FF', '#7000FF', '#38BDF8', '#E0F7FA'],
    glowColor: 'rgba(0, 240, 255, 0.75)',
    type: 'tech',
  },
  {
    id: 'coffee_logo',
    label: 'Coffee Logo',
    subtitle: 'BrewHaus Signature Emblem',
    icon: <Award className="w-4 h-4 text-amber-400" />,
    symbolText: '☕',
    fontStyle: 'bold 95px "Segoe UI Emoji", sans-serif',
    colorPalette: ['#FFD700', '#E6C280', '#D4A574', '#FFF5EA'],
    glowColor: 'rgba(255, 215, 0, 0.7)',
    type: 'emoji',
  },
  {
    id: 'initials',
    label: 'Developer Initials',
    subtitle: 'Varun Joshi (VJ)',
    icon: <User className="w-4 h-4 text-emerald-400" />,
    symbolText: 'VJ',
    fontStyle: '900 80px "Inter", "Playfair Display", sans-serif',
    colorPalette: ['#FFFFFF', '#FDE047', '#E2E8F0', '#CBD5E1'],
    glowColor: 'rgba(255, 255, 255, 0.85)',
    type: 'text',
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  tx: number;
  ty: number;
  size: number;
  maxSize: number;
  alpha: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
}

export default function SteamAIEffect({
  className = '',
  autoPlayDefault = true,
  initialInitials = 'VJ',
}: SteamAIEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [activeShapeIndex, setActiveShapeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlayDefault);
  const [initialsText, setInitialsText] = useState<string>(initialInitials);
  const [particleDensity, setParticleDensity] = useState<number>(450); // 300 to 700
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [heatLevel, setHeatLevel] = useState<number>(1.2); // Upward thermal float

  // Animation timeline refs
  const shapeIndexRef = useRef<number>(activeShapeIndex);
  const isPlayingRef = useRef<boolean>(isPlaying);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  const initialsRef = useRef<string>(initialsText);
  const phaseTimerRef = useRef<number>(0);
  const morphPhaseRef = useRef<'gather' | 'hold' | 'disperse'>('gather');

  shapeIndexRef.current = activeShapeIndex;
  isPlayingRef.current = isPlaying;
  soundEnabledRef.current = soundEnabled;
  initialsRef.current = initialsText;

  // Sound morph chime
  const playMorphChime = useCallback(() => {
    if (!soundEnabledRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      const baseFreq = 440 + activeShapeIndex * 120;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }, [activeShapeIndex]);

  // Generate target point coordinates for a shape by sampling offscreen canvas pixels
  const generateShapePoints = useCallback(
    (shape: ShapeDefinition, width: number, height: number, count: number): { x: number; y: number }[] => {
      const offscreen = document.createElement('canvas');
      const offWidth = 320;
      const offHeight = 320;
      offscreen.width = offWidth;
      offscreen.height = offHeight;
      const offCtx = offscreen.getContext('2d');

      if (!offCtx) return [];

      offCtx.clearRect(0, 0, offWidth, offHeight);
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#FFFFFF';

      const renderText = shape.id === 'initials' ? initialsRef.current || 'VJ' : shape.symbolText;
      offCtx.font = shape.fontStyle;
      offCtx.fillText(renderText, offWidth / 2, offHeight / 2);

      const imgData = offCtx.getImageData(0, 0, offWidth, offHeight);
      const data = imgData.data;
      const validPoints: { x: number; y: number }[] = [];

      const step = 2;
      for (let y = 0; y < offHeight; y += step) {
        for (let x = 0; x < offWidth; x += step) {
          const alpha = data[(y * offWidth + x) * 4 + 3];
          if (alpha > 120) {
            validPoints.push({
              x: (x - offWidth / 2) * (width < 640 ? 0.95 : 1.2),
              y: (y - offHeight / 2) * (width < 640 ? 0.95 : 1.2),
            });
          }
        }
      }

      if (validPoints.length === 0) {
        // Fallback grid
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const r = 60;
          validPoints.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }
      }

      // Random sample to count
      const points: { x: number; y: number }[] = [];
      const centerX = width / 2;
      const centerY = height / 2 - 20;

      for (let i = 0; i < count; i++) {
        const pt = validPoints[Math.floor(Math.random() * validPoints.length)];
        // Add tiny jitter for organic steam feel
        const jitterX = (Math.random() - 0.5) * 4;
        const jitterY = (Math.random() - 0.5) * 4;
        points.push({
          x: centerX + pt.x + jitterX,
          y: centerY + pt.y + jitterY,
        });
      }

      return points;
    },
    []
  );

  // Switch to specific shape manually
  const triggerShape = (index: number) => {
    setActiveShapeIndex(index);
    phaseTimerRef.current = 0;
    morphPhaseRef.current = 'gather';
    playMorphChime();
  };

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let currentWidth = canvas.clientWidth || 600;
    let currentHeight = canvas.clientHeight || 450;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      currentWidth = containerRef.current.clientWidth;
      currentHeight = containerRef.current.clientHeight || 450;
      canvas.width = currentWidth * dpr;
      canvas.height = currentHeight * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      const activeShape = SHAPES[shapeIndexRef.current];
      const targetPts = generateShapePoints(activeShape, currentWidth, currentHeight, particleDensity);

      const emitterX = currentWidth / 2;
      const emitterY = currentHeight - 40;

      particles = [];
      for (let i = 0; i < particleDensity; i++) {
        const target = targetPts[i] || { x: emitterX, y: currentHeight / 2 };
        const palette = activeShape.colorPalette;
        const color = palette[Math.floor(Math.random() * palette.length)];

        particles.push({
          x: emitterX + (Math.random() * 80 - 40),
          y: emitterY + (Math.random() * 20 - 10),
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(1.2 + Math.random() * 1.5) * heatLevel,
          baseX: emitterX,
          baseY: emitterY,
          tx: target.x,
          ty: target.y,
          size: 3 + Math.random() * 5,
          maxSize: 18 + Math.random() * 22,
          alpha: Math.random() * 0.7 + 0.2,
          color,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.015 + Math.random() * 0.02,
          orbitRadius: 2 + Math.random() * 6,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed: 0.02 + Math.random() * 0.04,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, currentWidth, currentHeight);

      const activeShape = SHAPES[shapeIndexRef.current];

      // Auto cycle timing logic
      if (isPlayingRef.current) {
        phaseTimerRef.current += 1;
        // Total cycle: ~260 frames (~4.3s at 60fps)
        if (phaseTimerRef.current < 60) {
          morphPhaseRef.current = 'gather';
        } else if (phaseTimerRef.current < 190) {
          morphPhaseRef.current = 'hold';
        } else if (phaseTimerRef.current < 250) {
          morphPhaseRef.current = 'disperse';
        } else {
          // Advance shape
          phaseTimerRef.current = 0;
          const nextIndex = (shapeIndexRef.current + 1) % SHAPES.length;
          shapeIndexRef.current = nextIndex;
          setActiveShapeIndex(nextIndex);
          if (soundEnabledRef.current) playMorphChime();

          // Refresh target coordinates
          const newTargets = generateShapePoints(SHAPES[nextIndex], currentWidth, currentHeight, particles.length);
          const newPalette = SHAPES[nextIndex].colorPalette;
          particles.forEach((p, idx) => {
            if (newTargets[idx]) {
              p.tx = newTargets[idx].x;
              p.ty = newTargets[idx].y;
            }
            p.color = newPalette[Math.floor(Math.random() * newPalette.length)];
          });
        }
      }

      // Draw background ambient steam glow around shape target
      ctx.save();
      const glowGrad = ctx.createRadialGradient(
        currentWidth / 2,
        currentHeight / 2 - 20,
        0,
        currentWidth / 2,
        currentHeight / 2 - 20,
        180
      );
      glowGrad.addColorStop(0, activeShape.glowColor);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, currentWidth, currentHeight);
      ctx.restore();

      // Update and render particles
      const phase = morphPhaseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobble += p.wobbleSpeed;
        p.orbitAngle += p.orbitSpeed;

        if (phase === 'gather' || phase === 'hold') {
          // Spring force towards target coordinate (tx, ty)
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;

          const pullForce = phase === 'gather' ? 0.08 : 0.05;
          p.vx += dx * pullForce;
          p.vy += dy * pullForce;

          // Friction damper
          p.vx *= 0.82;
          p.vy *= 0.82;

          // Gentle orbital motion during hold phase
          if (phase === 'hold') {
            p.x += Math.cos(p.orbitAngle) * 0.4 + Math.sin(p.wobble) * 0.3;
            p.y += Math.sin(p.orbitAngle) * 0.4;
          }

          p.x += p.vx;
          p.y += p.vy;

          // Shrink size to sharp point formation
          p.size += (4 - p.size) * 0.08;
          p.alpha += (0.85 - p.alpha) * 0.06;
        } else {
          // Disperse phase: Thermal upward steam float
          p.vx += (Math.random() - 0.5) * 0.4 + Math.sin(p.wobble) * 0.5;
          p.vy -= 0.05 * heatLevel;

          p.x += p.vx;
          p.y += p.vy;

          // Expand size like rising steam
          p.size += (p.maxSize - p.size) * 0.02;
          p.alpha *= 0.965;

          // Reset particle if it fades out or floats off screen
          if (p.alpha < 0.02 || p.y < -30) {
            p.x = currentWidth / 2 + (Math.random() * 80 - 40);
            p.y = currentHeight - 40 + (Math.random() * 20 - 10);
            p.vx = (Math.random() - 0.5) * 0.8;
            p.vy = -(1.2 + Math.random() * 1.5) * heatLevel;
            p.alpha = Math.random() * 0.6 + 0.2;
            p.size = 3 + Math.random() * 4;
          }
        }

        // Render individual particle radial steam drop
        ctx.save();
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, p.size));
        pGrad.addColorStop(0, p.color);
        pGrad.addColorStop(0.5, p.color);
        pGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleDensity, heatLevel, generateShapePoints, playMorphChime]);

  const activeShape = SHAPES[activeShapeIndex];

  return (
    <section
      ref={containerRef}
      id="steam-ai-lab"
      className={`relative w-full overflow-hidden rounded-3xl border border-white/10 backdrop-blur-2xl bg-gradient-to-b from-[#1E110A]/90 via-[#140A06]/95 to-[#0A0503] shadow-2xl p-6 sm:p-8 ${className}`}
    >
      {/* Header Title & Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 z-20 relative">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-lg">
              <Cpu className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              Steam AI Particle Engine
            </span>
            <span className="text-xs text-amber-200/60 font-mono hidden sm:inline">
              Sequence: ☕ ➔ ❤️ ➔ 💻 ➔ ☕ ➔ VJ
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-serif">
            Interactive Morphing Steam
            <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
          </h2>
          <p className="text-sm text-stone-300/80 mt-1 max-w-xl">
            Watch rising coffee steam intelligently morph through iconic shapes using fluid particle dynamics.
          </p>
        </div>

        {/* Interactive Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-xl border ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            {isPlaying ? 'Pause Auto-Play' : 'Resume Morphing'}
          </button>

          <button
            onClick={() => {
              const nextIndex = (activeShapeIndex + 1) % SHAPES.length;
              triggerShape(nextIndex);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 transition-all shadow-md"
            title="Next Shape"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Next Shape</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-all shadow-md ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-stone-800/60 text-stone-400 border-stone-700'
            }`}
            title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full h-[380px] sm:h-[450px] rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 cursor-pointer" />

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-15" />

        {/* Active Shape Floating Overlay Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeShape.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 left-4 z-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md shadow-2xl pointer-events-none"
          >
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              {activeShape.icon}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-amber-400/90 font-mono">
                Active Formation [{activeShapeIndex + 1}/5]
              </div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                {activeShape.label}
                <span className="text-xs font-normal text-stone-300/80">({activeShape.subtitle})</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Custom Initials Input Field */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md shadow-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
            Initials:
          </span>
          <input
            type="text"
            maxLength={4}
            value={initialsText}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setInitialsText(val);
              if (activeShape.id === 'initials') {
                triggerShape(4);
              }
            }}
            className="w-14 bg-white/10 text-white font-black text-center text-xs py-1 rounded border border-amber-500/30 focus:outline-none focus:border-amber-400 font-mono"
            placeholder="VJ"
          />
        </div>

        {/* Steam Base Emitter Visual Cue */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none opacity-80">
          <div className="w-16 h-2 rounded-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent blur-xs animate-pulse" />
          <span className="text-[10px] text-amber-200/60 uppercase tracking-widest font-mono mt-0.5">
            ♨ Thermal Cup Emitter
          </span>
        </div>
      </div>

      {/* Shape Selector Bar */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2.5 z-20 relative">
        {SHAPES.map((shape, idx) => {
          const isActive = idx === activeShapeIndex;
          return (
            <button
              key={shape.id}
              onClick={() => triggerShape(idx)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left duration-300 shadow-lg ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/25 to-orange-500/20 border-amber-400 text-white shadow-amber-500/10 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-300 hover:text-white'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive ? 'bg-amber-400 text-black font-bold' : 'bg-white/10 text-stone-300'
                }`}
              >
                {shape.icon}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold tracking-wide truncate">{shape.label}</div>
                <div className="text-[10px] text-stone-400 truncate">
                  {shape.id === 'initials' ? initialsText || 'VJ' : shape.symbolText}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Density & Thermal Heat Control Sliders */}
      <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
        <div className="flex items-center justify-between gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="font-semibold text-amber-200/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Particle Density: <span className="font-mono text-white">{particleDensity}</span>
          </span>
          <input
            type="range"
            min={250}
            max={650}
            step={50}
            value={particleDensity}
            onChange={(e) => setParticleDensity(Number(e.target.value))}
            className="w-28 accent-amber-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="font-semibold text-amber-200/90 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Thermal Rise Speed: <span className="font-mono text-white">{heatLevel.toFixed(1)}x</span>
          </span>
          <input
            type="range"
            min={0.8}
            max={2.2}
            step={0.2}
            value={heatLevel}
            onChange={(e) => setHeatLevel(Number(e.target.value))}
            className="w-28 accent-amber-400 cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
}
