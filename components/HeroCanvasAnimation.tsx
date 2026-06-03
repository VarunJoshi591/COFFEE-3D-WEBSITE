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
const createTintedCanvas = (img: HTMLImageElement, color: string, alpha: number = 0.5): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(img, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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

  // Smooth scroll-driven parallax hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001
  });

  const scrollVelocity = useSpring(useVelocity(scrollYProgress), {
    stiffness: 100,
    damping: 30
  });

  const TOTAL_FRAMES = 60;

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

    const checkAllLoaded = () => {
      // Calculate progress based on loaded status of base assets and frames
      const totalLoaded = baseLoaded + (framesFailed ? 0 : framesLoadedCount);
      const totalToLoad = baseAssetsToLoad.length + (framesFailed ? 0 : TOTAL_FRAMES);
      setLoadProgress((totalLoaded / totalToLoad) * 100);

      // Check if we can resolve asset state (base assets are mandatory)
      if (baseLoaded === baseAssetsToLoad.length) {
        const loadedBeanImg = tempBase.beanImg;
        // Apply #D4A574 tint to floating coffee bean particles
        const tintedBean = loadedBeanImg ? createTintedCanvas(loadedBeanImg, '#D4A574', 0.45) : null;

        const useFallback = framesFailed || frameElements.length === 0;

        // Set state when either fallback is triggered or all frames are loaded
        if (useFallback || framesLoadedCount === TOTAL_FRAMES) {
          setAssets({
            studioImg: tempBase.studioImg,
            cafeImg: tempBase.cafeImg,
            beanImg: tintedBean,
            frames: useFallback ? [] : frameElements,
            useFramesFallback: useFallback
          });
          setAssetsLoaded(true);
        }
      }
    };

    // Load baseline images
    baseAssetsToLoad.forEach((asset) => {
      const img = new Image();
      img.src = asset.src;
      img.onload = () => {
        tempBase[asset.key] = img;
        baseLoaded++;
        checkAllLoaded();
      };
      img.onerror = () => {
        console.error(`Failed to load baseline asset: ${asset.src}`);
        baseLoaded++;
        checkAllLoaded();
      };
    });

    // Load frame sequences: frame_001.png to frame_060.png
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/frame_${frameNum}.png`;
      img.onload = () => {
        if (!framesFailed) {
          frameElements[i - 1] = img;
          framesLoadedCount++;
          checkAllLoaded();
        }
      };
      img.onerror = () => {
        if (!framesFailed) {
          framesFailed = true;
          console.warn("Canvas animation frame sequences not found. Falling back to smooth cross-fade scene animation.");
          checkAllLoaded();
        }
      };
    }
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

    // Initialize 3D Floating Coffee Beans
    const beans: FloatingBean[] = Array.from({ length: 15 }, () => ({
      xPct: 0.05 + Math.random() * 0.9,
      yPct: 0.1 + Math.random() * 0.8,
      depth: 0.3 + Math.random() * 0.9, // smaller values = background, larger values = foreground
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() * 0.015 - 0.0075),
      bobOffset: Math.random() * Math.PI * 2,
      bobSpeed: 0.01 + Math.random() * 0.01,
      bobRange: 10 + Math.random() * 15
    }));

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
      
      const scrollVal = smoothProgress.get();
      const scrollVelVal = scrollVelocity.get();

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

        // Base Cover calculations
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * zoomFactor;
        const w = img.width * scale;
        const h = img.height * scale;
        
        // Centered coordinates + mouse parallax + scroll offsets + vertical spring offset
        const x = (canvas.width - w) / 2 + mouseOffsetX;
        const y = (canvas.height - h) / 2 + mouseOffsetY + scrollOffsetY + cupYOffset;

        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
      };

      if (!useFramesFallback && frames.length === TOTAL_FRAMES) {
        // Frame-by-frame mode: Map scrollProgress (0 to 1) to active frame index (0 to 59)
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

      // Helper: Draw floating bean
      const drawBean = (bean: FloatingBean) => {
        ctx.save();
        
        // Base positioning + depth-dependent parallax offsets
        const beanX = bean.xPct * canvas.width + currentMouseX * 55 * bean.depth;
        const beanY = bean.yPct * canvas.height + scrollVal * -250 * bean.depth + Math.sin(time * bean.bobSpeed + bean.bobOffset) * bean.bobRange;

        // Calculate rotation and scale
        bean.rotation += bean.rotSpeed;
        const beanScale = bean.depth * 0.16; // Adjust size
        const w = (beanImg as any).width * beanScale;
        const h = (beanImg as any).height * beanScale;

        // Depth Blur simulation using canvas filters (if supported)
        if (bean.depth < 0.5) {
          ctx.filter = `blur(${Math.round((0.5 - bean.depth) * 6)}px)`;
        } else if (bean.depth > 1.0) {
          ctx.filter = `blur(${Math.round((bean.depth - 1.0) * 4)}px)`;
        }

        ctx.translate(beanX, beanY);
        ctx.rotate(bean.rotation);
        ctx.drawImage(beanImg, -w / 2, -h / 2, w, h);
        ctx.restore();
      };

      // 1. Draw Background Beans (depth < 0.6)
      beans.filter(b => b.depth < 0.6).forEach(drawBean);

      // Emitter details: Positioned right above the cup on canvas (linked with cup's vertical float)
      const emitterX = canvas.width / 2 + mouseOffsetX;
      const emitterY = canvas.height * 0.64 + mouseOffsetY + scrollOffsetY + cupYOffset;

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

      // 4. Draw Foreground Beans (depth >= 0.6)
      beans.filter(b => b.depth >= 0.6).forEach(drawBean);

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
    <div ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Cinematic Text Overlays */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          
          {/* Section 1 */}
          <motion.div style={{ opacity: section1Opacity }} className="text-center px-4 max-w-3xl">
            <span className="text-[#4F9C8F] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 font-inter">
              Introducing L&apos;Aroma
            </span>
            <h1 className="text-8xl md:text-9xl font-playfair font-bold text-amber-50/95 mb-6 tracking-tighter leading-none drop-shadow-[0_0_25px_rgba(253,251,235,0.35)]">
              Experience Coffee
            </h1>
            <p className="text-lg md:text-2xl text-[#C9B8A0] font-inter max-w-xl mx-auto font-light leading-relaxed">
              Where every sensory note defies gravity and floats in perfect equilibrium.
            </p>
          </motion.div>

          {/* Section 2 */}
          <motion.div style={{ opacity: section2Opacity }} className="text-left px-8 md:px-24 max-w-3xl mr-auto">
            <span className="text-[#D4A574] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 font-inter">
              The Alchemy of Taste
            </span>
            <h2 className="text-5xl md:text-7xl font-playfair font-semibold text-amber-50/95 mb-4 tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(253,251,235,0.25)]">
              Crafted to Perfection
            </h2>
            <p className="text-base md:text-lg text-[#C9B8A0] font-inter max-w-md font-light leading-relaxed">
              From hand-selected single-origin beans to precision micro-roasting, excellence floats in every warm drop.
            </p>
          </motion.div>

          {/* Section 3 */}
          <motion.div style={{ opacity: section3Opacity }} className="text-right px-8 md:px-24 max-w-3xl ml-auto">
            <span className="text-[#4F9C8F] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-3 font-inter">
              Procedural Sensation
            </span>
            <h2 className="text-5xl md:text-7xl font-playfair font-semibold text-amber-50/95 mb-4 tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(253,251,235,0.25)]">
              Anti-Gravity Flavor
            </h2>
            <p className="text-base md:text-lg text-[#C9B8A0] font-inter max-w-md ml-auto font-light leading-relaxed">
              Defying expectations and elevating taste beyond the physical limits of traditional brewing.
            </p>
          </motion.div>

          {/* Section 4 */}
          <motion.div style={{ opacity: section4Opacity }} className="text-center px-4 max-w-3xl">
            <span className="text-[#D4A574] font-bold tracking-[0.3em] uppercase text-xs md:text-sm block mb-4 font-inter">
              Ready to Brew
            </span>
            <h2 className="text-5xl md:text-8xl font-playfair font-bold text-amber-50/95 mb-8 tracking-tighter drop-shadow-[0_0_25px_rgba(253,251,235,0.35)]">
              Discover Your Blend
            </h2>
            <motion.a
              href="#blends"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(79, 156, 143, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-5 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] text-white rounded-full text-lg font-bold font-inter shadow-2xl pointer-events-auto tracking-wider uppercase"
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
