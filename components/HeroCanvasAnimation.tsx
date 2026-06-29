'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';

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

class SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  decay: number;
  wobblePhase: number;
  wobbleSpeed: number;

  constructor(x: number, y: number, scrollVel: number) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 1.6 - 0.8;
    this.vy = -(0.8 + Math.random() * 1.5) - Math.abs(scrollVel) * 15;
    this.size = 1.2 + Math.random() * 2.5;

    // Coffee-inspired glow colors: gold, orange-accent, teal-green
    const colors = ['#D4A574', '#FFD700', '#4F9C8F', '#FF8C00'];
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.alpha = 0.5 + Math.random() * 0.5;
    this.life = 0;
    this.decay = 0.002 + Math.random() * 0.003;
    this.wobblePhase = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.01 + Math.random() * 0.03;
  }

  update(scrollVel: number) {
    this.life += this.decay;
    this.wobblePhase += this.wobbleSpeed;

    this.x += this.vx + Math.sin(this.wobblePhase) * 0.4 + scrollVel * 3;
    this.y += this.vy - Math.abs(scrollVel) * 6;

    // Spark pulses and fades
    this.alpha = Math.max(0, (1 - this.life) * (0.6 + Math.sin(this.wobblePhase * 3) * 0.4));
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.save();
    
    // Faint aura
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha * 0.2;
    ctx.fill();

    // Bright core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();

    ctx.restore();
  }
}

interface FloatingBean {
  xPct: number;
  yPct: number;
  depth: number;      // 0.2 to 1.2 (for parallax layering)
  rotation: number;
  rotSpeed: number;
  bobOffset: number;
  bobSpeed: number;
  bobRange: number;
}


// Helper to tint an image with a specific color on an offscreen canvas
const createTintedCanvas = (img: HTMLImageElement, color: string, alpha: number = 0.5): HTMLCanvasElement | HTMLImageElement => {
  if (!img || img.width === 0 || img.height === 0) {
    return img;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // 1. Draw the original transparent image
    ctx.drawImage(img, 0, 0);
    
    // 2. Parse hex color to rgb
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    try {
      // 3. Extract pixel data
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // 4. Tint opaque pixels (preserving the exact alpha channel)
      for (let i = 0; i < data.length; i += 4) {
        const pixelAlpha = data[i + 3];
        if (pixelAlpha > 0) {
          data[i] = Math.round(data[i] * (1 - alpha) + r * alpha);     // Red
          data[i + 1] = Math.round(data[i + 1] * (1 - alpha) + g * alpha); // Green
          data[i + 2] = Math.round(data[i + 2] * (1 - alpha) + b * alpha); // Blue
        }
      }
      
      // 5. Write pixel data back
      ctx.putImageData(imgData, 0, 0);
    } catch (e) {
      console.warn("Tinting failed due to security/sandbox context. Falling back to untinted image.", e);
    }
  }
  return canvas;
};

export default function HeroCanvasAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [assets, setAssets] = useState<{
    studioImg: HTMLImageElement | null;
    cafeImg: HTMLImageElement | null;
    beanImg: HTMLImageElement | HTMLCanvasElement | null;
    frames: HTMLImageElement[];
    useFramesFallback: boolean;
  }>({ studioImg: null, cafeImg: null, beanImg: null, frames: [], useFramesFallback: true });
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
 
  // Track mount state to avoid useScroll target hydration runtime errors
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
 
  useEffect(() => {
    if (containerRef.current) {
      setTargetElement(containerRef.current);
    }
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

  const TOTAL_FRAMES = 120;

  // Preload primary design assets and animation frames
  useEffect(() => {
    const baseAssetsToLoad = [
      { key: 'studioImg', src: '/cup_studio.png' },
      { key: 'cafeImg', src: '/cup_cafe.jpg' },
      { key: 'beanImg', src: '/coffee/bean.png' }
    ];
 
    let baseLoaded = 0;
    const tempBase: any = {};
 
    const frameElements: HTMLImageElement[] = [];
    let framesLoadedCount = 0;
    let framesFailed = false;
    let isFinished = false; // Flag to prevent multiple state updates
 
    const resolveBaseAssets = () => {
      const loadedBeanImg = tempBase.beanImg;
      // Apply #D4A574 tint to floating coffee bean particles
      const tintedBean = loadedBeanImg ? createTintedCanvas(loadedBeanImg, '#D4A574', 0.45) : null;
 
      // Set baseline assets immediately so page mounts fast
      setAssets({
        studioImg: tempBase.studioImg,
        cafeImg: tempBase.cafeImg,
        beanImg: tintedBean,
        frames: [],
        useFramesFallback: true
      });
      setAssetsLoaded(true);
 
      // Start loading frames in background after baseline resolves
      preloadFrames();
    };
 
    const preloadFrames = () => {
      // Load frame sequences: frame_0.webp to frame_119.webp
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `/frames/frame_${i}.webp`;
        img.onload = () => {
          if (!framesFailed) {
            frameElements[i] = img;
            framesLoadedCount++;
            
            if (framesLoadedCount === TOTAL_FRAMES && !isFinished) {
              isFinished = true;
              setAssets(prev => ({
                ...prev,
                frames: frameElements,
                useFramesFallback: false
              }));
            }
          }
        };
        img.onerror = () => {
          if (!framesFailed) {
            framesFailed = true;
            console.warn("Canvas animation frame sequences not found or incomplete. Keeping smooth cross-fade fallback.");
          }
        };
      }
    };
 
    // Load baseline images
    baseAssetsToLoad.forEach((asset) => {
      const img = new Image();
      img.src = asset.src;
      img.onload = () => {
        tempBase[asset.key] = img;
        baseLoaded++;
        setLoadProgress((baseLoaded / baseAssetsToLoad.length) * 100);
        if (baseLoaded === baseAssetsToLoad.length) {
          resolveBaseAssets();
        }
      };
      img.onerror = () => {
        console.error(`Failed to load baseline asset: ${asset.src}`);
        baseLoaded++;
        setLoadProgress((baseLoaded / baseAssetsToLoad.length) * 100);
        if (baseLoaded === baseAssetsToLoad.length) {
          resolveBaseAssets();
        }
      };
    });
  }, []);

  // Main canvas animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!assetsLoaded || !canvas || !assets.studioImg || !assets.cafeImg || !assets.beanImg) return;

    const { studioImg, cafeImg, beanImg, frames, useFramesFallback } = assets;
    if (!studioImg || !cafeImg || !beanImg) return;

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
    const sparkParticles: SparkParticle[] = [];





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

    // Spring physics vertical floating simulation constants
    let cupYOffset = 0;
    let cupYVelocity = 0;

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
      const zoomFactor = 1.02 + scrollVal * 0.08;
      const mouseOffsetX = currentMouseX * 35;
      const mouseOffsetY = currentMouseY * 35;
      const scrollOffsetY = scrollVal * -60;

      // Anti-gravity float: spring-mass system driven by scroll velocity and bobbing motion
      const targetCupY = scrollVelVal * -280 + Math.sin(time * 0.035) * 15;
      const cupForce = (targetCupY - cupYOffset) * 0.08; // spring tension constant
      cupYVelocity += cupForce;
      cupYVelocity *= 0.88; // damping factor
      cupYOffset += cupYVelocity;

      // Helper: Draw an image center with scroll, parallax, and anti-gravity vertical spring adjustments
      const drawImageCenter = (img: HTMLImageElement | HTMLCanvasElement, alpha: number) => {
        if (alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
 
        // Base Contain calculations with mobile scale optimization
        const isMobile = canvas.width < 768;
        const mobileScaleMultiplier = isMobile ? 1.35 : 1.0;
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * zoomFactor * mobileScaleMultiplier;
        const w = img.width * scale;
        const h = img.height * scale;
        
        // Centered coordinates + mouse parallax + scroll offsets + vertical spring offset
        const x = (canvas.width - w) / 2 + mouseOffsetX;
        const y = (canvas.height - h) / 2 + mouseOffsetY + scrollOffsetY + cupYOffset;
 
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
      };

      /*
      if (!useFramesFallback && frames.length === TOTAL_FRAMES) {
        // Frame-by-frame mode: Map scrollProgress (0 to 1) to active frame index (0 to 119)
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(scrollVal * TOTAL_FRAMES));
        const activeFrame = frames[frameIndex];
        if (activeFrame) {
          drawImageCenter(activeFrame, 1.0);
        }
      } else {
        // Fallback scene cross-fade mode
        const studioOpacity = Math.max(0, Math.min(1, 1 - (scrollVal - 0.2) / 0.5));
        const cafeOpacity = Math.max(0, Math.min(1, (scrollVal - 0.2) / 0.5));
        drawImageCenter(cafeImg, cafeOpacity);
        drawImageCenter(studioImg, studioOpacity);
      }
      */

      // Vignette effect to blend background images seamlessly with the deep espresso #1A0F0A background
      ctx.save();
      const vignetteGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.25,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.7
      );
      vignetteGrad.addColorStop(0, 'rgba(26, 15, 10, 0)');
      vignetteGrad.addColorStop(0.5, 'rgba(26, 15, 10, 0.45)');
      vignetteGrad.addColorStop(1, '#1A0F0A');
      
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();





      // Emitter details: Positioned right above the cup on canvas (linked with cup's vertical float and responsive scaling)
      const isMobile = canvas.width < 768;
      const mobileScaleMultiplier = isMobile ? 1.35 : 1.0;
      const baseScale = Math.min(canvas.width / (studioImg?.width || 1920), canvas.height / (studioImg?.height || 1080)) * zoomFactor * mobileScaleMultiplier;
      const cupH = (studioImg?.height || 1080) * baseScale;
      const cupTopY = (canvas.height - cupH) / 2 + mouseOffsetY + scrollOffsetY + cupYOffset;
      const emitterX = canvas.width / 2 + mouseOffsetX;
      const emitterY = cupTopY + cupH * 0.64;

      // 2. Spawn & Draw Steam Particles
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

      // 3. Spawn & Draw Aroma Bokeh Sparks
      const spawnSparkInterval = Math.max(1, Math.round(4 - Math.abs(scrollVelVal) * 35));
      if (time % spawnSparkInterval === 0 && sparkParticles.length < 120) {
        const startX = Math.random() > 0.4 ? emitterX + (Math.random() * 40 - 20) : Math.random() * canvas.width;
        const startY = Math.random() > 0.4 ? emitterY : canvas.height + 10;
        sparkParticles.push(new SparkParticle(startX, startY, scrollVelVal));
      }

      for (let i = sparkParticles.length - 1; i >= 0; i--) {
        const p = sparkParticles[i];
        p.update(scrollVelVal);
        if (p.life >= 1 || p.y < -50 || p.alpha <= 0) {
          sparkParticles.splice(i, 1);
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
  }, [assetsLoaded, assets, smoothProgress, scrollVelocity]);

  // Section text opacity calculations (synced with scrolling progress)
  const section1Opacity = useTransform(smoothProgress, [0, 0.08, 0.18, 0.24], [0, 1, 1, 0]);
  const section2Opacity = useTransform(smoothProgress, [0.28, 0.34, 0.48, 0.54], [0, 1, 1, 0]);
  const section3Opacity = useTransform(smoothProgress, [0.58, 0.64, 0.78, 0.84], [0, 1, 1, 0]);
  const section4Opacity = useTransform(smoothProgress, [0.88, 0.93, 0.98, 1.0], [0, 1, 1, 0]);
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  if (!assetsLoaded) {
    return (
      <div className="fixed inset-0 bg-[#1A0F0A] flex flex-col items-center justify-center z-50">
        <div className="w-64 h-2 bg-[#5A4034]/30 rounded-full overflow-hidden mb-4 border border-[#5A4034]/50">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4A574] to-[#4F9C8F]"
            initial={{ width: '0%' }}
            animate={{ width: `${loadProgress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <p className="text-[#F5E6D3]/70 text-lg font-inter tracking-wider">
          Brewing Experience... {Math.round(loadProgress)}%
        </p>
      </div>
    );
  }

  return (
    <div id="hero" ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Cinematic Text Overlays */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          
          {/* Section 1 */}
          <motion.div style={{ opacity: section1Opacity }} className="text-center px-4 max-w-3xl">
            <span className="text-[#4F9C8F] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 font-inter">
              BREWHAUS · EST. 2014
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-playfair font-bold text-amber-50/95 tracking-tighter leading-none drop-shadow-[0_0_25px_rgba(253,251,235,0.35)] flex flex-col items-center">
              <span>Experience</span>
              <span className="italic font-playfair font-normal text-coffee-accent mt-2">Coffee</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-[#C9B8A0] font-inter max-w-xl mx-auto font-light leading-relaxed mt-6">
              Where each bean tells a story and every sip is a quiet ritual. Discover blends crafted by master baristas.
            </p>
            <div className="mt-8 pointer-events-auto">
              <a
                href="#blends"
                className="inline-block px-8 py-3.5 bg-coffee-accent text-coffee-espresso rounded-full text-xs md:text-sm font-bold font-inter tracking-widest uppercase hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg shadow-coffee-accent/20 hover:shadow-coffee-accent/40"
              >
                Discover Blends
              </a>
            </div>
          </motion.div>
 
          {/* Section 2 */}
          <motion.div style={{ opacity: section2Opacity }} className="text-center lg:text-left px-6 sm:px-12 md:px-24 max-w-3xl lg:mr-auto lg:ml-0 mx-auto">
            <span className="text-[#D4A574] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 font-inter">
              The Alchemy of Taste
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold text-amber-50/95 mb-4 tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(253,251,235,0.25)]">
              Crafted to Perfection
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-md mx-auto lg:mx-0 font-light leading-relaxed">
              From hand-selected single-origin beans to precision micro-roasting, excellence floats in every warm drop.
            </p>
          </motion.div>
 
          {/* Section 3 */}
          <motion.div style={{ opacity: section3Opacity }} className="text-center lg:text-right px-6 sm:px-12 md:px-24 max-w-3xl lg:ml-auto lg:mr-0 mx-auto">
            <span className="text-[#4F9C8F] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 font-inter">
              Procedural Sensation
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold text-amber-50/95 mb-4 tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(253,251,235,0.25)]">
              Anti-Gravity Flavor
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-md mx-auto lg:mr-0 lg:ml-auto font-light leading-relaxed">
              Defying expectations and elevating taste beyond the physical limits of traditional brewing.
            </p>
          </motion.div>
 
          {/* Section 4 */}
          <motion.div style={{ opacity: section4Opacity }} className="text-center px-4 max-w-3xl">
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
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p className="text-[#C9B8A0]/60 text-[10px] md:text-xs font-inter tracking-[0.25em] uppercase">
            Scroll to Explore
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border border-[#C9B8A0]/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-2.5 bg-[#4F9C8F] rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
