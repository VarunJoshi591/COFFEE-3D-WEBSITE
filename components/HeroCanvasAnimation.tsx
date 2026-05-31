"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useVelocity, useTransform, motion } from "framer-motion";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  isBean: boolean;
  angle: number;
  spin: number;
}

interface SteamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  growth: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
}

// Responsive fit logic (CSS object-fit: cover equivalent for Canvas)
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let drawW = w;
  let drawH = h;
  let drawX = 0;
  let drawY = 0;

  if (imgRatio > targetRatio) {
    drawW = h * imgRatio;
    drawX = (w - drawW) / 2;
  } else {
    drawH = w / imgRatio;
    drawY = (h - drawH) / 2;
  }
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

export default function HeroCanvasAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [studioImg, setStudioImg] = useState<HTMLImageElement | null>(null);
  const [cafeImg, setCafeImg] = useState<HTMLImageElement | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Mouse position ref for smooth 3D parallax
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const currentMouseOffset = useRef({ x: 0, y: 0 });

  // Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth Spring Interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0005,
  });

  // Velocity tracking to drive physics
  const scrollVelocity = useVelocity(scrollYProgress);
  const [absoluteVelocity, setAbsoluteVelocity] = useState(0);

  // Track if scrolling is active to fade indicator
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      const timer = setTimeout(() => setIsScrolling(false), 800);
      return () => clearTimeout(timer);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync scroll velocity state
  useEffect(() => {
    return scrollVelocity.on("change", (latest) => {
      setAbsoluteVelocity(Math.min(Math.abs(latest) * 25, 12)); // Cap particle velocity boost
    });
  }, [scrollVelocity]);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Text Overlay Transform calculations (smooth opacity and translate overrides)
  // Text 1: 0% -> 25% scroll (Crafted to Perfection)
  const text1Opacity = useTransform(smoothProgress, [0, 0.18, 0.25], [1, 0.8, 0]);
  const text1Y = useTransform(smoothProgress, [0, 0.25], [0, -50]);

  // Text 2: 30% -> 60% scroll (The Aroma Eruption)
  const text2Opacity = useTransform(smoothProgress, [0.28, 0.38, 0.52, 0.62], [0, 1, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.28, 0.62], [50, -50]);

  // Text 3: 65% -> 100% scroll (Unrivaled Sensation)
  const text3Opacity = useTransform(smoothProgress, [0.65, 0.78, 1], [0, 1, 1]);
  const text3Y = useTransform(smoothProgress, [0.65, 1], [50, 0]);

  // Preloading Logic
  useEffect(() => {
    let active = true;

    const imgStudio = new Image();
    imgStudio.src = "/cup_studio.png";

    const imgCafe = new Image();
    imgCafe.src = "/cup_cafe.jpg";

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / 2) * 100);
      setLoadingProgress(pct);
      if (loadedCount === 2) {
        if (active) {
          setStudioImg(imgStudio);
          setCafeImg(imgCafe);
          setIsPreloaded(true);
        }
      }
    };

    imgStudio.onload = checkLoaded;
    imgStudio.onerror = checkLoaded;
    imgCafe.onload = checkLoaded;
    imgCafe.onerror = checkLoaded;

    return () => {
      active = false;
    };
  }, []);

  // Canvas Drawing & Physics Loop
  useEffect(() => {
    if (!isPreloaded || !studioImg || !cafeImg) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize particle arrays
    const particles: Particle[] = [];
    const steamParticles: SteamParticle[] = [];
    const maxParticles = 100;
    const maxSteamParticles = 85;

    // Create initial floating particles
    for (let i = 0; i < 35; i++) {
      particles.push(createParticle(true));
    }

    function createParticle(randomY = false): Particle {
      const isBean = Math.random() > 0.65;
      return {
        x: Math.random() * CANVAS_WIDTH,
        y: randomY ? Math.random() * CANVAS_HEIGHT : CANVAS_HEIGHT + 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -0.4 - Math.random() * 1.2,
        size: isBean ? 8 + Math.random() * 10 : 3 + Math.random() * 5,
        alpha: 0.15 + Math.random() * 0.5,
        color: isBean ? "#3D2214" : Math.random() > 0.5 ? "#4F9C8F" : "#FFD700",
        isBean,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.03,
      };
    }

    function createSteamParticle(emitX: number, emitY: number): SteamParticle {
      return {
        x: emitX + (Math.random() - 0.5) * 20,
        y: emitY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.6 - Math.random() * 0.6,
        size: 8 + Math.random() * 6,
        growth: 0.12 + Math.random() * 0.08,
        alpha: 0,
        maxAlpha: 0.35 + Math.random() * 0.45,
        life: 0,
        maxLife: 120 + Math.random() * 80,
      };
    }

    let animationId: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Get current smooth scroll value (spring interpolated)
      const currentScroll = smoothProgress.get();

      // Draw rich warm background base (to hide any seams)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, "#1A0F0A"); // rich espresso
      bgGrad.addColorStop(1, "#0A0503"); // extra dark roasted espresso
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Cross-fade progress
      // 0.0 to 0.4 -> Studio cup only
      // 0.4 to 0.7 -> Fading transition
      // 0.7 to 1.0 -> Cafe scene only
      const fadeProgress = Math.min(Math.max((currentScroll - 0.4) / 0.3, 0), 1);
      const studioOpacity = 1 - fadeProgress;
      const cafeOpacity = fadeProgress;

      // Parallax Zoom
      const baseScale = 1.02 + currentScroll * 0.06;

      // Smooth mouse offset interpolation
      const maxMouseOffset = 28;
      currentMouseOffset.current.x +=
        ((mousePos.current.x - 0.5) * maxMouseOffset - currentMouseOffset.current.x) * 0.08;
      currentMouseOffset.current.y +=
        ((mousePos.current.y - 0.5) * maxMouseOffset - currentMouseOffset.current.y) * 0.08;

      // Draw Images
      ctx.save();
      ctx.translate(
        CANVAS_WIDTH / 2 + currentMouseOffset.current.x,
        CANVAS_HEIGHT / 2 + currentMouseOffset.current.y
      );
      ctx.scale(baseScale, baseScale);
      ctx.translate(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2);

      // Render Studio scene
      if (studioOpacity > 0 && studioImg.complete) {
        ctx.save();
        ctx.globalAlpha = studioOpacity;
        drawImageCover(ctx, studioImg, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.restore();
      }

      // Render Cafe scene
      if (cafeOpacity > 0 && cafeImg.complete) {
        ctx.save();
        ctx.globalAlpha = cafeOpacity;
        drawImageCover(ctx, cafeImg, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.restore();
      }
      ctx.restore();

      // Vignette Overlay to blend the mockup edges beautifully
      const vignetteGrad = ctx.createRadialGradient(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        CANVAS_WIDTH * 0.3,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        CANVAS_WIDTH * 0.75
      );
      vignetteGrad.addColorStop(0, "rgba(0,0,0,0)");
      vignetteGrad.addColorStop(0.7, "rgba(26,15,10,0.25)");
      vignetteGrad.addColorStop(1, "rgba(10,5,3,0.92)");
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // --- PROCEDURAL STEAM SIMULATION ---
      // Emitters move as cups shift layout
      // Studio cup positions (at scroll = 0):
      // - Left (cream) cup mouth: x=0.58, y=0.32
      // - Right (brown) cup mouth: x=0.77, y=0.22
      // Cafe cup positions (at scroll = 1):
      // - Left (cream) cup mouth: x=0.44, y=0.38
      // - Right (brown) cup mouth: x=0.60, y=0.28
      const emit1X = CANVAS_WIDTH * (0.58 * (1 - fadeProgress) + 0.44 * fadeProgress);
      const emit1Y = CANVAS_HEIGHT * (0.32 * (1 - fadeProgress) + 0.38 * fadeProgress);

      const emit2X = CANVAS_WIDTH * (0.77 * (1 - fadeProgress) + 0.60 * fadeProgress);
      const emit2Y = CANVAS_HEIGHT * (0.22 * (1 - fadeProgress) + 0.28 * fadeProgress);

      // Spawn steam particles
      const velocityFactor = 1 + absoluteVelocity * 0.25;
      if (Math.random() < 0.12 && steamParticles.length < maxSteamParticles) {
        steamParticles.push(createSteamParticle(emit1X, emit1Y));
      }
      if (Math.random() < 0.12 && steamParticles.length < maxSteamParticles) {
        steamParticles.push(createSteamParticle(emit2X, emit2Y));
      }

      // Update and draw steam
      for (let i = steamParticles.length - 1; i >= 0; i--) {
        const p = steamParticles[i];
        p.life++;
        if (p.life >= p.maxLife) {
          steamParticles.splice(i, 1);
          continue;
        }

        p.x += p.vx + Math.sin(Date.now() * 0.004 + p.maxLife) * 0.28;
        p.y += p.vy * velocityFactor;
        p.size += p.growth;

        // Calculate alpha fade in/out
        const lifeRatio = p.life / p.maxLife;
        let alphaVal = 0;
        if (lifeRatio < 0.15) {
          alphaVal = (lifeRatio / 0.15) * p.maxAlpha;
        } else {
          alphaVal = (1 - (lifeRatio - 0.15) / 0.85) * p.maxAlpha;
        }

        ctx.save();
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        radGrad.addColorStop(0, `rgba(245, 230, 211, ${alphaVal * 0.22})`);
        radGrad.addColorStop(0.5, `rgba(245, 230, 211, ${alphaVal * 0.07})`);
        radGrad.addColorStop(1, "rgba(245, 230, 211, 0)");
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- FLOATING BEANS & BOKEH SPARKS ---
      const particleVelocityBoost = absoluteVelocity;

      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Dynamic velocity: base drift up + added kinetic upward force of scroll
        p.y += p.vy - particleVelocityBoost * 0.7;
        p.x += p.vx + Math.sin(Date.now() * 0.001 + p.size) * 0.25;
        p.angle += p.spin;

        // Reset particles once they exit screen top or sides
        if (p.y < -30) {
          particles[i] = createParticle(false);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;

        if (p.isBean) {
          // Draw a stylized floating coffee bean
          ctx.fillStyle = "#3D2214"; // rich espresso bean dark color

          // Bean body oval
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();

          // Coffee bean center groove line
          ctx.strokeStyle = "#1A0F0A";
          ctx.lineWidth = p.size * 0.15;
          ctx.beginPath();
          ctx.moveTo(-p.size * 0.8, -p.size * 0.15);
          ctx.bezierCurveTo(
            -p.size * 0.2,
            p.size * 0.35,
            p.size * 0.2,
            -p.size * 0.35,
            p.size * 0.8,
            p.size * 0.15
          );
          ctx.stroke();
        } else {
          // Draw a glowing bokeh aroma drop
          const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          radGrad.addColorStop(
            0,
            p.color === "#4F9C8F" ? "rgba(79, 156, 143, 0.95)" : "rgba(255, 215, 0, 0.95)"
          );
          radGrad.addColorStop(
            0.3,
            p.color === "#4F9C8F" ? "rgba(79, 156, 143, 0.4)" : "rgba(255, 215, 0, 0.4)"
          );
          radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();

      // Dynamic spawn boost: if user is scrolling fast, spawn temporary premium aroma sparks!
      if (particleVelocityBoost > 3 && particles.length < maxParticles) {
        particles.push(createParticle(false));
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPreloaded, studioImg, cafeImg, absoluteVelocity, smoothProgress]);

  // Handle high-density responsive canvas scaling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      // Fit inside container but keep fixed aspect ratio
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const scale = Math.min(containerWidth / CANVAS_WIDTH, containerHeight / CANVAS_HEIGHT);

      canvas.style.width = `${CANVAS_WIDTH * scale}px`;
      canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
    };

    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isPreloaded]);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-coffee-espresso">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* HTML5 Canvas */}
        {isPreloaded && (
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block max-w-full max-h-full pointer-events-none select-none z-10"
          />
        )}

        {/* Circular Loading Progress Overlay */}
        {!isPreloaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-coffee-espresso z-50 transition-opacity duration-700">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Spinning circular progress track */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="stroke-coffee-border"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="stroke-coffee-accent transition-all duration-300"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - loadingProgress / 100)}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute text-coffee-textPrimary font-semibold text-lg font-inter">
                {loadingProgress}%
              </div>
            </div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-coffee-textSecondary text-xs tracking-[0.3em] font-playfair uppercase"
            >
              Brewing Experience...
            </motion.h3>
          </div>
        )}

        {/* --- PREMIUM SCRIPTY / SERIF TEXT OVERLAYS --- */}
        {isPreloaded && (
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center px-12 md:px-24">
            <div className="max-w-4xl text-left flex flex-col justify-center h-full">
              {/* Segment 1: Crafted to Perfection */}
              <motion.div
                style={{ opacity: text1Opacity, y: text1Y }}
                className="absolute flex flex-col items-start"
              >
                <span className="text-coffee-accent text-sm md:text-base tracking-[0.4em] font-semibold uppercase mb-4 block animate-pulse">
                  Est. 2026 / Specialty Grade
                </span>
                <h1 className="text-6xl md:text-8xl lg:text-[8.5rem] font-bold font-playfair tracking-tight leading-[0.9] text-coffee-textPrimary drop-shadow-xl">
                  CRAFTED TO
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-textPrimary via-coffee-textSecondary to-coffee-accent">
                    PERFECTION
                  </span>
                </h1>
                <p className="mt-8 text-coffee-textSecondary text-base md:text-lg max-w-md font-inter leading-relaxed">
                  Every cherry picked by hand. Every bean roasted to unlock chocolatey depth, rich
                  aroma, and full-bodied smoothness.
                </p>
              </motion.div>

              {/* Segment 2: The Aroma Eruption */}
              <motion.div
                style={{ opacity: text2Opacity, y: text2Y }}
                className="absolute flex flex-col items-start opacity-0"
              >
                <span className="text-coffee-accent text-sm md:text-base tracking-[0.4em] font-semibold uppercase mb-4 block">
                  Sensoric Shockwave
                </span>
                <h2 className="text-6xl md:text-8xl lg:text-[8.5rem] font-bold font-playfair tracking-tight leading-[0.9] text-coffee-textPrimary drop-shadow-xl">
                  THE AROMA
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-accent to-[#D4A574]">
                    ERUPTION
                  </span>
                </h2>
                <p className="mt-8 text-coffee-textSecondary text-base md:text-lg max-w-md font-inter leading-relaxed">
                  Witness the collision of high-speed fluid dynamics and anti-gravity aroma particles
                  lifting off in perfect harmony.
                </p>
              </motion.div>

              {/* Segment 3: Unrivaled Sensation */}
              <motion.div
                style={{ opacity: text3Opacity, y: text3Y }}
                className="absolute flex flex-col items-start opacity-0"
              >
                <span className="text-coffee-accent text-sm md:text-base tracking-[0.4em] font-semibold uppercase mb-4 block animate-bounce">
                  Reserve Yours Today
                </span>
                <h2 className="text-6xl md:text-8xl lg:text-[8.5rem] font-bold font-playfair tracking-tight leading-[0.9] text-coffee-textPrimary drop-shadow-xl">
                  UNRIVALED
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-coffee-textPrimary via-coffee-accent to-coffee-gold">
                    SENSATION
                  </span>
                </h2>
                <p className="mt-8 text-coffee-textSecondary text-base md:text-lg max-w-md font-inter leading-relaxed font-semibold">
                  Scroll down to discover our artisanal product grid and claim your personal coffee
                  blend collection.
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {/* Scroll Indicator Icon */}
        {isPreloaded && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isScrolling ? 0 : 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-25 pointer-events-none"
          >
            <span className="text-coffee-textSecondary text-[0.65rem] tracking-[0.4em] uppercase mb-2 font-inter">
              Scroll Down to Brew
            </span>
            <div className="w-6 h-10 border-2 border-coffee-border rounded-full p-1 flex items-start justify-center">
              <motion.div
                animate={{
                  y: [0, 12, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 bg-coffee-accent rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
