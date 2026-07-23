'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// Particle classes for the procedural canvas engine

class SteamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  life: number;
  decay: number;
  wobble: number;
  wobbleSpeed: number;

  constructor(x: number, y: number, scrollVel: number) {
    this.x = x + (Math.random() * 30 - 15);
    this.y = y + (Math.random() * 15 - 7.5);
    this.vx = Math.random() * 0.8 - 0.4;
    // Upward velocity increases with scrolling
    this.vy = -(1.2 + Math.random() * 1.5) - Math.abs(scrollVel) * 12;
    this.size = 5 + Math.random() * 5;
    this.maxSize = 35 + Math.random() * 25;
    this.alpha = 0;
    this.life = 0;
    this.decay = 0.003 + Math.random() * 0.004;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.015 + Math.random() * 0.02;
  }

  update(scrollVel: number) {
    this.life += this.decay;
    this.wobble += this.wobbleSpeed;

    // Drifts up and wobbles horizontally. Scroll velocity adds positive horizontal/vertical forces.
    this.x += this.vx + Math.sin(this.wobble) * 0.5 + scrollVel * 4;
    this.y += this.vy - Math.abs(scrollVel) * 5;

    // Grow in size over time
    this.size += (this.maxSize - this.size) * 0.015;

    // Fade in initially, then fade out slowly
    if (this.life < 0.2) {
      this.alpha = (this.life / 0.2) * 0.18;
    } else {
      this.alpha = Math.max(0, 0.18 * (1 - (this.life - 0.2) / 0.8));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.save();
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    // Warm coffee latte steam color: #F5E6D3
    grad.addColorStop(0, `rgba(245, 230, 211, ${this.alpha})`);
    grad.addColorStop(0.4, `rgba(245, 230, 211, ${this.alpha * 0.4})`);
    grad.addColorStop(1, 'rgba(245, 230, 211, 0)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}


export default function HeroCanvasAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [cafeBg, setCafeBg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      setTargetElement(containerRef.current);
    }
  }, []);

  // Preload background café ambiance image
  useEffect(() => {
    const img = new Image();
    img.src = '/cup_cafe.jpg';
    img.onload = () => {
      setCafeBg(img);
    };
  }, []);

  // Smooth scroll-driven parallax hooks
  const { scrollYProgress } = useScroll({
    target: targetElement ? containerRef : undefined,
    offset: ['start start', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollVelocity = useSpring(useVelocity(scrollYProgress), {
    stiffness: 100,
    damping: 30
  });

  // Main canvas animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Mouse coordinates configuration
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Particle arrays
    const steamParticles: SteamParticle[] = [];

    // Mouse position event tracker
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) - 0.5; // -0.5 to 0.5
      targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation Loop
    const loop = () => {
      time++;
      
      let scrollVal = smoothProgress.get();
      if (typeof scrollVal !== 'number' || isNaN(scrollVal)) {
        scrollVal = 0;
      }
      
      let scrollVelVal = scrollVelocity.get();
      if (typeof scrollVelVal !== 'number' || isNaN(scrollVelVal)) {
        scrollVelVal = 0;
      }

      // Clear Screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse coordinates with easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Parallax configurations
      const mouseOffsetX = currentMouseX * 35;
      const mouseOffsetY = currentMouseY * 35;
      const scrollOffsetY = scrollVal * -60;

      // 1. Draw atmospheric café background image
      if (cafeBg) {
        ctx.save();
        const scale = Math.max(canvas.width / cafeBg.width, canvas.height / cafeBg.height) * 1.05;
        const w = cafeBg.width * scale;
        const h = cafeBg.height * scale;
        const x = (canvas.width - w) / 2 + mouseOffsetX * 0.3;
        const y = (canvas.height - h) / 2 + mouseOffsetY * 0.3 + scrollOffsetY * 0.2;
        ctx.drawImage(cafeBg, x, y, w, h);
        ctx.restore();
      }

      // 2. Dark overlay filter for optimal text contrast & moody coffee house warmth
      ctx.save();
      ctx.fillStyle = 'rgba(26, 15, 10, 0.65)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // 3. Vignette gradient to blend edges smoothly into deep espresso #1A0F0A
      ctx.save();
      const vignetteGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.2,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.75
      );
      vignetteGrad.addColorStop(0, 'rgba(26, 15, 10, 0.25)');
      vignetteGrad.addColorStop(0.6, 'rgba(26, 15, 10, 0.65)');
      vignetteGrad.addColorStop(1, '#1A0F0A');
      
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Emitter position for ambient steam
      const emitterX = canvas.width / 2 + mouseOffsetX;
      const emitterY = canvas.height * 0.55 + mouseOffsetY + scrollOffsetY;

      // 4. Spawn & Draw Steam Particles
      const spawnSteamInterval = Math.max(2, Math.round(6 - Math.abs(scrollVelVal) * 50));
      if (time % spawnSteamInterval === 0 && steamParticles.length < 80) {
        steamParticles.push(new SteamParticle(emitterX, emitterY, scrollVelVal));
      }

      for (let i = steamParticles.length - 1; i >= 0; i--) {
        const p = steamParticles[i];
        p.update(scrollVelVal);
        if (p.life >= 1) {
          steamParticles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      // Trigger next frame
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [cafeBg, smoothProgress, scrollVelocity]);

  // Section text opacity calculations (synced with scrolling progress)
  const section1Opacity = useTransform(smoothProgress, [0, 0.08, 0.18, 0.24], [1, 1, 1, 0]);
  const section2Opacity = useTransform(smoothProgress, [0.28, 0.34, 0.48, 0.54], [0, 1, 1, 0]);
  const section3Opacity = useTransform(smoothProgress, [0.58, 0.64, 0.78, 0.84], [0, 1, 1, 0]);
  const section4Opacity = useTransform(smoothProgress, [0.88, 0.93, 0.98, 1.0], [0, 1, 1, 0]);
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  return (
    <div id="hero" ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Cinematic Text Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          
          {/* Section 1 */}
          <motion.div style={{ opacity: section1Opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-3xl flex flex-col items-center">
              <span className="text-[#4F9C8F] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-4 font-inter">
                BREWHAUS · EST. 2014
              </span>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-playfair font-normal text-[#F5E6D3] tracking-tight leading-none flex flex-col items-center mb-6 drop-shadow-md">
                <span>Experience</span>
                <span className="italic font-playfair font-normal text-[#4F9C8F] mt-1">Coffee</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-xl mx-auto font-light leading-relaxed mb-8">
                Where each bean tells a story and every sip is a quiet ritual.<br className="hidden sm:inline" />
                {' '}Discover blends crafted by master baristas.
              </p>
              <div className="pointer-events-auto flex flex-col items-center gap-3">
                <a
                  href="#blends"
                  className="inline-block px-8 py-3.5 bg-[#4F9C8F] text-[#1A0F0A] rounded-full text-xs md:text-sm font-bold font-inter tracking-widest uppercase hover:bg-[#3D8B7F] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-[#4F9C8F]/25"
                >
                  Discover Blends
                </a>
                <motion.a
                  href="#blends"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="text-[#4F9C8F] hover:text-[#3D8B7F] transition-colors mt-2"
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.a>
              </div>
            </div>
          </motion.div>
  
          {/* Section 2 */}
          <motion.div style={{ opacity: section2Opacity }} className="absolute inset-0 flex flex-col justify-center items-center lg:items-start px-6 sm:px-12 md:px-24 text-center lg:text-left">
            <div className="max-w-3xl lg:mr-auto lg:ml-0 mx-auto">
              <span className="text-[#D4A574] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 font-inter">
                The Alchemy of Taste
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold text-amber-50/95 mb-4 tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(253,251,235,0.25)]">
                Crafted to Perfection
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-md mx-auto lg:mx-0 font-light leading-relaxed">
                From hand-selected single-origin beans to precision micro-roasting, excellence floats in every warm drop.
              </p>
            </div>
          </motion.div>
  
          {/* Section 3 */}
          <motion.div style={{ opacity: section3Opacity }} className="absolute inset-0 flex flex-col justify-center items-center lg:items-end px-6 sm:px-12 md:px-24 text-center lg:text-right">
            <div className="max-w-3xl lg:ml-auto lg:mr-0 mx-auto">
              <span className="text-[#4F9C8F] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 font-inter">
                Procedural Sensation
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold text-amber-50/95 mb-4 tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(253,251,235,0.25)]">
                Anti-Gravity Flavor
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-md mx-auto lg:mr-0 lg:ml-auto font-light leading-relaxed">
                Defying expectations and elevating taste beyond the physical limits of traditional brewing.
              </p>
            </div>
          </motion.div>
  
          {/* Section 4 */}
          <motion.div style={{ opacity: section4Opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-3xl">
              <span className="text-[#D4A574] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-4 font-inter">
                Ready to Brew
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-amber-50/95 mb-8 tracking-tighter drop-shadow-[0_0_25px_rgba(253,251,235,0.35)]">
                Discover Your Blend
              </h2>
              <motion.a
                href="#blends"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(79, 156, 143, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] text-white rounded-full text-sm md:text-lg font-bold font-inter shadow-2xl pointer-events-auto tracking-widest uppercase"
              >
                Explore Collection ↓
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-[#4F9C8F] text-2xl"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
