'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import { ChevronDown, RotateCcw, Play } from 'lucide-react';
import { useTheme } from './ThemeProvider';

// Particle classes for natural steam movement and pour splash effects

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
    this.x = x + (Math.random() * 40 - 20);
    this.y = y + (Math.random() * 10 - 5);
    this.vx = Math.random() * 0.6 - 0.3;
    // Upward thermal buoyancy
    this.vy = -(1.0 + Math.random() * 1.4) - Math.abs(scrollVel) * 10;
    this.size = 6 + Math.random() * 6;
    this.maxSize = 40 + Math.random() * 30;
    this.alpha = 0;
    this.life = 0;
    this.decay = 0.003 + Math.random() * 0.003;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.012 + Math.random() * 0.02;
  }

  update(scrollVel: number) {
    this.life += this.decay;
    this.wobble += this.wobbleSpeed;

    // Drifts up and wobbles naturally with sine dynamics
    this.x += this.vx + Math.sin(this.wobble) * 0.6 + scrollVel * 4;
    this.y += this.vy - Math.abs(scrollVel) * 4;

    // Expand size gently as steam dissipates
    this.size += (this.maxSize - this.size) * 0.014;

    // Fade in smoothly then fade out
    if (this.life < 0.25) {
      this.alpha = (this.life / 0.25) * 0.22;
    } else {
      this.alpha = Math.max(0, 0.22 * (1 - (this.life - 0.25) / 0.75));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.save();
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    grad.addColorStop(0, `rgba(245, 230, 211, ${this.alpha})`);
    grad.addColorStop(0.45, `rgba(245, 230, 211, ${this.alpha * 0.45})`);
    grad.addColorStop(1, 'rgba(245, 230, 211, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  gravity: number;
  life: number;

  constructor(x: number, y: number, isMilk: boolean) {
    this.x = x + (Math.random() * 8 - 4);
    this.y = y + (Math.random() * 4 - 2);
    const angle = (Math.random() * Math.PI) - Math.PI / 2; // arc upwards
    const speed = 1.5 + Math.random() * 3.5;
    this.vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
    this.vy = -Math.abs(Math.sin(angle) * speed) - 1.0;
    this.size = isMilk ? 1.5 + Math.random() * 2 : 2 + Math.random() * 2.5;
    this.alpha = 0.8 + Math.random() * 0.2;
    this.color = isMilk ? '#FFFDF9' : (Math.random() > 0.4 ? '#D4A574' : '#3A1F13');
    this.gravity = 0.15;
    this.life = 1.0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= 0.04;
    this.alpha = Math.max(0, this.life);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default function HeroCanvasAnimation() {
  const { colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  // Pour simulation state
  const pourFrameRef = useRef<number>(0);
  const [isPouring, setIsPouring] = useState<boolean>(true);
  const [pourProgressState, setPourProgressState] = useState<number>(0);

  const resetPourAnimation = useCallback(() => {
    pourFrameRef.current = 0;
    setIsPouring(true);
    setPourProgressState(0);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setTargetElement(containerRef.current);
    }
  }, []);

  // Smooth scroll-driven hooks
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

  // Canvas animation & simulation loop
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
    const splashParticles: SplashParticle[] = [];

    // Mouse position tracker
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) - 0.5;
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

    // Main animation loop
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

      // Calculate pour timeline progress (Total ~320 frames ~5.3 seconds)
      const TOTAL_POUR_FRAMES = 320;
      if (pourFrameRef.current < TOTAL_POUR_FRAMES) {
        pourFrameRef.current++;
        const currentProgress = pourFrameRef.current / TOTAL_POUR_FRAMES;
        if (Math.abs(currentProgress - pourProgressState) > 0.02) {
          setPourProgressState(currentProgress);
        }
      } else if (isPouring) {
        setIsPouring(false);
        setPourProgressState(1);
      }

      const rawProgress = Math.min(1.0, pourFrameRef.current / TOTAL_POUR_FRAMES);

      // Smooth mouse easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const mouseOffsetX = currentMouseX * 35;
      const mouseOffsetY = currentMouseY * 35;
      const scrollOffsetY = scrollVal * -60;

      // Clear Screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Dark Espresso Atmospheric Canvas Base
      ctx.save();
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2 + mouseOffsetX * 0.2,
        canvas.height * 0.45 + mouseOffsetY * 0.2 + scrollOffsetY * 0.2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.75
      );
      bgGrad.addColorStop(0, colors.canvasBg1);
      bgGrad.addColorStop(0.5, colors.canvasBg2);
      bgGrad.addColorStop(1, colors.canvasBg3);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // 3. Radial Vignette Gradient
      ctx.save();
      const vignetteGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) * 0.2,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.8
      );
      vignetteGrad.addColorStop(0, 'rgba(26, 15, 10, 0.2)');
      vignetteGrad.addColorStop(0.65, 'rgba(26, 15, 10, 0.7)');
      vignetteGrad.addColorStop(1, '#130A06');

      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // CUP & POURING ENGINE CALCULATIONS
      const cupCenterX = canvas.width / 2 + mouseOffsetX;
      const isMobileScreen = canvas.width < 640;
      const cupCenterY = canvas.height * (isMobileScreen ? 0.53 : 0.56) + mouseOffsetY + scrollOffsetY;

      // Cup Geometry Dimensions (Dynamically scaled for mobile phones & tablets)
      const cupRadiusX = Math.min(140, Math.max(82, canvas.width * (isMobileScreen ? 0.28 : 0.18)));
      const cupRadiusY = cupRadiusX * 0.28;
      const cupHeight = cupRadiusX * 1.25;

      // Fill progress (0.0 to 1.0)
      // Phase 1 (0 to 0.48): Espresso pour fills cup to 50%
      // Phase 2 (0.48 to 0.90): Milk pour fills cup to 100% & blooms Latte Art
      // Phase 3 (0.90 to 1.0): Finish pour
      const fillLevel = Math.min(1.0, rawProgress * 1.12); // reaches 1.0 around frame 285

      const liquidSurfaceY = (cupCenterY + cupHeight * 0.38) - fillLevel * (cupHeight * 0.76);
      const liquidRadiusX = cupRadiusX * (0.8 + 0.18 * fillLevel);
      const liquidRadiusY = cupRadiusY * (0.8 + 0.18 * fillLevel);

      // --- DRAW SAUCER SHADOW & SAUCER ---
      ctx.save();
      // Shadow
      ctx.beginPath();
      ctx.ellipse(cupCenterX, cupCenterY + cupHeight * 0.5 + 18, cupRadiusX * 1.45, cupRadiusY * 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.filter = 'blur(12px)';
      ctx.fill();
      ctx.filter = 'none';

      // Saucer Dish
      ctx.beginPath();
      ctx.ellipse(cupCenterX, cupCenterY + cupHeight * 0.5, cupRadiusX * 1.4, cupRadiusY * 1.1, 0, 0, Math.PI * 2);
      const saucerGrad = ctx.createLinearGradient(cupCenterX - cupRadiusX, 0, cupCenterX + cupRadiusX, 0);
      saucerGrad.addColorStop(0, '#2A1D17');
      saucerGrad.addColorStop(0.5, '#4A342B');
      saucerGrad.addColorStop(1, '#1C120D');
      ctx.fillStyle = saucerGrad;
      ctx.fill();
      ctx.strokeStyle = '#6E4D3E';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // --- DRAW CUP HANDLE ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(cupCenterX + cupRadiusX * 0.95, cupCenterY, cupHeight * 0.28, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.lineWidth = cupRadiusX * 0.18;
      const handleGrad = ctx.createLinearGradient(cupCenterX + cupRadiusX, 0, cupCenterX + cupRadiusX * 1.4, 0);
      handleGrad.addColorStop(0, '#3A261C');
      handleGrad.addColorStop(0.5, '#5A3E30');
      handleGrad.addColorStop(1, '#23140C');
      ctx.strokeStyle = handleGrad;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      // --- DRAW CERAMIC CUP BODY ---
      ctx.save();
      // Outer Cup Silhouette Path
      ctx.beginPath();
      // Rim top arc
      ctx.ellipse(cupCenterX, cupCenterY - cupHeight * 0.38, cupRadiusX, cupRadiusY, 0, Math.PI, 0, true);
      // Right side curve down to base
      ctx.bezierCurveTo(
        cupCenterX + cupRadiusX * 0.98, cupCenterY + cupHeight * 0.1,
        cupCenterX + cupRadiusX * 0.85, cupCenterY + cupHeight * 0.48,
        cupCenterX + cupRadiusX * 0.7, cupCenterY + cupHeight * 0.48
      );
      // Base bottom arc
      ctx.ellipse(cupCenterX, cupCenterY + cupHeight * 0.48, cupRadiusX * 0.7, cupRadiusY * 0.7, 0, 0, Math.PI, false);
      // Left side curve up to rim
      ctx.bezierCurveTo(
        cupCenterX - cupRadiusX * 0.85, cupCenterY + cupHeight * 0.48,
        cupCenterX - cupRadiusX * 0.98, cupCenterY + cupHeight * 0.1,
        cupCenterX - cupRadiusX, cupCenterY - cupHeight * 0.38
      );
      ctx.closePath();

      // Ceramic Body Shader Gradient
      const cupBodyGrad = ctx.createLinearGradient(
        cupCenterX - cupRadiusX, cupCenterY,
        cupCenterX + cupRadiusX, cupCenterY
      );
      cupBodyGrad.addColorStop(0, '#1E120B');
      cupBodyGrad.addColorStop(0.2, '#3D281D');
      cupBodyGrad.addColorStop(0.5, '#54382A');
      cupBodyGrad.addColorStop(0.8, '#322016');
      cupBodyGrad.addColorStop(1, '#150A05');

      ctx.fillStyle = cupBodyGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 165, 116, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Cup Cavity Clipping Mask (for liquid rise)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cupCenterX, cupCenterY - cupHeight * 0.38, cupRadiusX * 0.94, cupRadiusY * 0.94, 0, 0, Math.PI * 2);
      ctx.bezierCurveTo(
        cupCenterX + cupRadiusX * 0.92, cupCenterY + cupHeight * 0.08,
        cupCenterX + cupRadiusX * 0.8, cupCenterY + cupHeight * 0.45,
        cupCenterX + cupRadiusX * 0.65, cupCenterY + cupHeight * 0.45
      );
      ctx.ellipse(cupCenterX, cupCenterY + cupHeight * 0.45, cupRadiusX * 0.65, cupRadiusY * 0.65, 0, 0, Math.PI, false);
      ctx.bezierCurveTo(
        cupCenterX - cupRadiusX * 0.8, cupCenterY + cupHeight * 0.45,
        cupCenterX - cupRadiusX * 0.92, cupCenterY + cupHeight * 0.08,
        cupCenterX - cupRadiusX * 0.94, cupCenterY - cupHeight * 0.38
      );
      ctx.closePath();
      ctx.clip();

      // Inner Cup Dark Ceramic Wall Background
      const innerWallGrad = ctx.createRadialGradient(
        cupCenterX, cupCenterY, cupRadiusX * 0.2,
        cupCenterX, cupCenterY, cupRadiusX * 1.1
      );
      innerWallGrad.addColorStop(0, '#2D1B12');
      innerWallGrad.addColorStop(1, '#0F0704');
      ctx.fillStyle = innerWallGrad;
      ctx.fillRect(cupCenterX - cupRadiusX * 1.2, cupCenterY - cupHeight, cupRadiusX * 2.4, cupHeight * 2);

      // --- RENDER RISING LIQUID & LATTE ART ---
      if (fillLevel > 0.01) {
        // Liquid Base Fill Geometry (from bottom of cup up to liquidSurfaceY)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cupCenterX, liquidSurfaceY, liquidRadiusX, liquidRadiusY, 0, 0, Math.PI * 2);
        ctx.rect(cupCenterX - liquidRadiusX * 1.2, liquidSurfaceY, liquidRadiusX * 2.4, cupCenterY + cupHeight - liquidSurfaceY);
        
        // Deep Espresso Liquid Body Gradient
        const liquidBodyGrad = ctx.createLinearGradient(0, liquidSurfaceY, 0, cupCenterY + cupHeight);
        liquidBodyGrad.addColorStop(0, '#4A2818');
        liquidBodyGrad.addColorStop(0.4, '#2E170C');
        liquidBodyGrad.addColorStop(1, '#1A0C06');
        ctx.fillStyle = liquidBodyGrad;
        ctx.fill();
        ctx.restore();

        // Liquid Top Surface Ellipse
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cupCenterX, liquidSurfaceY, liquidRadiusX, liquidRadiusY, 0, 0, Math.PI * 2);
        
        // Espresso Surface Base with Crema Gradient
        const surfaceGrad = ctx.createRadialGradient(
          cupCenterX, liquidSurfaceY, 0,
          cupCenterX, liquidSurfaceY, liquidRadiusX
        );
        surfaceGrad.addColorStop(0, '#663B23');
        surfaceGrad.addColorStop(0.6, '#422212');
        surfaceGrad.addColorStop(0.9, '#2B1409');
        surfaceGrad.addColorStop(1, '#190A04');
        ctx.fillStyle = surfaceGrad;
        ctx.fill();
        ctx.clip(); // Clip Latte Art to liquid top surface!

        // LATTE ART BLOOM SIMULATION (Phase 2: rawProgress from 0.40 to 1.0)
        const artProgress = Math.max(0, Math.min(1.0, (rawProgress - 0.40) / 0.50));

        if (artProgress > 0.01) {
          ctx.save();
          // Gentle rotation & wobble as pour finishes
          const swirlAngle = (1 - artProgress) * 0.35 + Math.sin(time * 0.02) * 0.03;
          ctx.translate(cupCenterX, liquidSurfaceY);
          ctx.rotate(swirlAngle);
          ctx.scale(1, liquidRadiusY / liquidRadiusX); // Scale to match 3D surface perspective

          const maxScale = liquidRadiusX * 0.78 * Math.pow(artProgress, 0.7);

          // Golden Crema Ring around Latte Art
          ctx.beginPath();
          ctx.arc(0, 0, maxScale * 1.08, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212, 165, 116, 0.45)';
          ctx.fill();

          // Outer Milk Foam Halo
          ctx.beginPath();
          ctx.arc(0, 0, maxScale, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 253, 249, 0.92)';
          ctx.fill();

          // Inner Golden Espresso Swirl Accents
          ctx.beginPath();
          ctx.arc(0, 0, maxScale * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = '#C8935A';
          ctx.fill();

          // MULTI-LAYER LATTE ART ROSETTA & HEART PATTERN
          const numLeaves = 6;
          for (let l = numLeaves; l >= 1; l--) {
            const leafScale = (l / numLeaves) * maxScale * 0.85;
            const leafYOffset = (numLeaves - l) * (maxScale * 0.12) - maxScale * 0.1;

            ctx.save();
            ctx.translate(0, leafYOffset);
            
            // Creamy White Foam Petal
            ctx.beginPath();
            ctx.moveTo(0, leafScale * 0.5);
            ctx.bezierCurveTo(
              leafScale * 0.9, -leafScale * 0.2,
              leafScale * 0.7, -leafScale * 0.8,
              0, -leafScale * 0.6
            );
            ctx.bezierCurveTo(
              -leafScale * 0.7, -leafScale * 0.8,
              -leafScale * 0.9, -leafScale * 0.2,
              0, leafScale * 0.5
            );
            ctx.fillStyle = l % 2 === 0 ? 'rgba(255, 253, 249, 0.96)' : 'rgba(247, 238, 226, 0.92)';
            ctx.fill();
            ctx.restore();
          }

          // Top Heart Crown on Rosetta
          const heartSize = maxScale * 0.28;
          const heartY = -maxScale * 0.42;
          ctx.save();
          ctx.translate(0, heartY);
          ctx.beginPath();
          ctx.moveTo(0, heartSize * 0.3);
          ctx.bezierCurveTo(
            heartSize * 0.6, -heartSize * 0.6,
            heartSize * 1.1, heartSize * 0.2,
            0, heartSize * 0.9
          );
          ctx.bezierCurveTo(
            -heartSize * 1.1, heartSize * 0.2,
            -heartSize * 0.6, -heartSize * 0.6,
            0, heartSize * 0.3
          );
          ctx.fillStyle = '#FFFDF9';
          ctx.fill();

          // Central Latte Art Drag Line (Barista etching pin detail)
          ctx.beginPath();
          ctx.moveTo(0, -maxScale * 0.55);
          ctx.lineTo(0, maxScale * 0.45);
          ctx.strokeStyle = '#B8824A';
          ctx.lineWidth = Math.max(1, maxScale * 0.035);
          ctx.stroke();

          ctx.restore();

          ctx.restore(); // End transformed Latte Art
        }

        // Concentric Ripple Effect on Surface from Pour Stream
        if (rawProgress > 0.02 && rawProgress < 0.92) {
          const rippleRadius = (time * 1.8) % (liquidRadiusX * 0.7);
          const rippleAlpha = Math.max(0, 1 - (rippleRadius / (liquidRadiusX * 0.7))) * 0.4;
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(cupCenterX, liquidSurfaceY, rippleRadius, rippleRadius * (liquidRadiusY / liquidRadiusX), 0, 0, Math.PI * 2);
          ctx.strokeStyle = rawProgress > 0.45 ? `rgba(255, 253, 249, ${rippleAlpha})` : `rgba(212, 165, 116, ${rippleAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore(); // End top liquid surface ellipse
      }

      ctx.restore(); // End inner cup clipping mask

      // --- DRAW CUP FRONT RIM HIGHLIGHT ---
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cupCenterX, cupCenterY - cupHeight * 0.38, cupRadiusX, cupRadiusY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 245, 235, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // --- 4. COFFEE & MILK POURING STREAMS ---
      // Stream origin at nozzle above cup
      const streamSourceX = cupCenterX + Math.sin(time * 0.03) * 3;
      const streamSourceY = cupCenterY - cupHeight * 1.8;
      const streamHitY = liquidSurfaceY;

      // Phase 1 (0.0 to 0.48): Espresso Stream
      if (rawProgress > 0.01 && rawProgress < 0.52) {
        const streamAlpha = rawProgress < 0.06 ? rawProgress / 0.06 : (rawProgress > 0.46 ? (0.52 - rawProgress) / 0.06 : 1.0);
        ctx.save();
        ctx.globalAlpha = streamAlpha;

        // Outer Liquid Stream Glow
        ctx.beginPath();
        ctx.moveTo(streamSourceX - 6, streamSourceY);
        ctx.quadraticCurveTo(
          streamSourceX - 2, (streamSourceY + streamHitY) / 2,
          cupCenterX - 4, streamHitY
        );
        ctx.lineTo(cupCenterX + 4, streamHitY);
        ctx.quadraticCurveTo(
          streamSourceX + 2, (streamSourceY + streamHitY) / 2,
          streamSourceX + 6, streamSourceY
        );
        ctx.closePath();

        const espressoStreamGrad = ctx.createLinearGradient(streamSourceX, streamSourceY, cupCenterX, streamHitY);
        espressoStreamGrad.addColorStop(0, '#5C3119');
        espressoStreamGrad.addColorStop(0.5, '#3B1E0F');
        espressoStreamGrad.addColorStop(1, '#241107');
        ctx.fillStyle = espressoStreamGrad;
        ctx.fill();

        // Inner Liquid Stream Highlight Core
        ctx.beginPath();
        ctx.moveTo(streamSourceX - 1.5, streamSourceY);
        ctx.lineTo(cupCenterX - 1, streamHitY);
        ctx.lineTo(cupCenterX + 1, streamHitY);
        ctx.lineTo(streamSourceX + 1.5, streamSourceY);
        ctx.fillStyle = 'rgba(212, 165, 116, 0.6)';
        ctx.fill();

        ctx.restore();

        // Spawn Espresso Splash Particles at hit point
        if (time % 2 === 0 && streamHitY <= cupCenterY + cupHeight * 0.45) {
          for (let p = 0; p < 2; p++) {
            splashParticles.push(new SplashParticle(cupCenterX, streamHitY, false));
          }
        }
      }

      // Phase 2 (0.45 to 0.92): Milk Stream for Latte Art
      if (rawProgress >= 0.44 && rawProgress < 0.94) {
        const milkAlpha = rawProgress < 0.50 ? (rawProgress - 0.44) / 0.06 : (rawProgress > 0.88 ? (0.94 - rawProgress) / 0.06 : 1.0);
        ctx.save();
        ctx.globalAlpha = milkAlpha;

        // Silky Milk Stream
        const milkSourceX = streamSourceX + 4;
        ctx.beginPath();
        ctx.moveTo(milkSourceX - 4.5, streamSourceY);
        ctx.quadraticCurveTo(
          milkSourceX - 1, (streamSourceY + streamHitY) / 2,
          cupCenterX - 3, streamHitY
        );
        ctx.lineTo(cupCenterX + 3, streamHitY);
        ctx.quadraticCurveTo(
          milkSourceX + 1, (streamSourceY + streamHitY) / 2,
          milkSourceX + 4.5, streamSourceY
        );
        ctx.closePath();

        const milkStreamGrad = ctx.createLinearGradient(milkSourceX, streamSourceY, cupCenterX, streamHitY);
        milkStreamGrad.addColorStop(0, '#FFFDF9');
        milkStreamGrad.addColorStop(0.6, '#F5EBE1');
        milkStreamGrad.addColorStop(1, '#E6D7C8');
        ctx.fillStyle = milkStreamGrad;
        ctx.fill();

        // Inner Sheen
        ctx.beginPath();
        ctx.moveTo(milkSourceX - 1, streamSourceY);
        ctx.lineTo(cupCenterX - 0.5, streamHitY);
        ctx.lineTo(cupCenterX + 0.5, streamHitY);
        ctx.lineTo(milkSourceX + 1, streamSourceY);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore();

        // Spawn Milk Splash Droplets
        if (time % 2 === 0 && streamHitY <= cupCenterY + cupHeight * 0.45) {
          for (let p = 0; p < 2; p++) {
            splashParticles.push(new SplashParticle(cupCenterX, streamHitY, true));
          }
        }
      }

      // Update & Draw Splash Particles
      for (let i = splashParticles.length - 1; i >= 0; i--) {
        const sp = splashParticles[i];
        sp.update();
        if (sp.life <= 0) {
          splashParticles.splice(i, 1);
        } else {
          sp.draw(ctx);
        }
      }

      // --- 5. NATURAL STEAM MOVEMENT ---
      // Emitter position rises from liquid surface level
      const steamEmitterX = cupCenterX;
      const steamEmitterY = fillLevel > 0.05 ? liquidSurfaceY - 5 : cupCenterY;

      // Continuous Steam Emission
      const spawnInterval = Math.max(2, Math.round(5 - Math.abs(scrollVelVal) * 40));
      if (time % spawnInterval === 0 && steamParticles.length < 90) {
        steamParticles.push(new SteamParticle(steamEmitterX, steamEmitterY, scrollVelVal));
      }

      // Update & Draw Natural Steam
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
  }, [smoothProgress, scrollVelocity, pourProgressState, isPouring, colors]);

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

        {/* Live Interactive Simulation Status Badge & Re-pour Button */}
        <div className="absolute top-20 sm:top-24 left-4 sm:left-6 md:left-12 z-30 flex items-center gap-2 sm:gap-3 pointer-events-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={resetPourAnimation}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#1A0F0A]/70 hover:bg-[#1A0F0A]/90 backdrop-blur-md border border-[#D4A574]/40 rounded-full text-[11px] sm:text-xs font-semibold text-[#F5E6D3] hover:text-white transition-all duration-300 shadow-xl group hover:border-[#4F9C8F]"
            title="Re-pour Coffee & Re-create Latte Art"
          >
            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4F9C8F] group-hover:rotate-180 transition-transform duration-500" />
            <span>Re-pour Coffee</span>
          </button>
          
          <div className="hidden xs:flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#1A0F0A]/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] sm:text-[11px] font-medium text-[#C9B8A0]">
            <span className="w-2 h-2 rounded-full bg-[#4F9C8F] animate-pulse" />
            <span>
              {isPouring 
                ? (pourProgressState < 0.45 ? 'Espresso Pouring...' : 'Pouring Milk & Creating Latte Art...')
                : 'Steaming Fresh & Ready'}
            </span>
          </div>
        </div>

        {/* Cinematic Text Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          
          {/* Section 1 */}
          <motion.div style={{ opacity: section1Opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-16 sm:pt-20 md:pt-24 text-center">
            <div className="max-w-3xl flex flex-col items-center">
              <span className="text-[#4F9C8F] font-extrabold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs md:text-sm block mb-3 sm:mb-4 font-inter">
                BREWHAUS · EST. 2014
              </span>
              <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-playfair font-normal text-[#F5E6D3] tracking-tight leading-none flex flex-col items-center mb-4 sm:mb-6 drop-shadow-md">
                <span>Experience</span>
                <span className="italic font-playfair font-normal text-[#4F9C8F] mt-0.5 sm:mt-1">Coffee</span>
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-xl mx-auto font-light leading-relaxed mb-6 sm:mb-8 px-2">
                Where each bean tells a story and every sip is a quiet ritual.<br className="hidden sm:inline" />
                {' '}Discover blends crafted by master baristas.
              </p>
              <div className="pointer-events-auto flex flex-col items-center gap-2 sm:gap-3">
                <a
                  href="#blends"
                  className="inline-block px-6 py-3 sm:px-8 sm:py-3.5 bg-[#4F9C8F] text-[#1A0F0A] rounded-full text-xs md:text-sm font-bold font-inter tracking-widest uppercase hover:bg-[#3D8B7F] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-[#4F9C8F]/25"
                >
                  Discover Blends
                </a>
                <motion.a
                  href="#blends"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="text-[#4F9C8F] hover:text-[#3D8B7F] transition-colors mt-1 sm:mt-2"
                >
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
              </div>
            </div>
          </motion.div>
  
          {/* Section 2 */}
          <motion.div style={{ opacity: section2Opacity }} className="absolute inset-0 flex flex-col justify-center items-center lg:items-start px-4 sm:px-12 md:px-24 text-center lg:text-left">
            <div className="max-w-3xl lg:mr-auto lg:ml-0 mx-auto">
              <span className="text-[#D4A574] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs md:text-sm block mb-2 sm:mb-3 font-inter">
                The Alchemy of Taste
              </span>
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold text-amber-50/95 mb-3 sm:mb-4 tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(253,251,235,0.25)]">
                Crafted to Perfection
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-md mx-auto lg:mx-0 font-light leading-relaxed px-2 sm:px-0">
                From hand-selected single-origin beans to precision micro-roasting, excellence floats in every warm drop.
              </p>
            </div>
          </motion.div>
  
          {/* Section 3 */}
          <motion.div style={{ opacity: section3Opacity }} className="absolute inset-0 flex flex-col justify-center items-center lg:items-end px-4 sm:px-12 md:px-24 text-center lg:text-right">
            <div className="max-w-3xl lg:ml-auto lg:mr-0 mx-auto">
              <span className="text-[#4F9C8F] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs md:text-sm block mb-2 sm:mb-3 font-inter">
                Procedural Sensation
              </span>
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold text-amber-50/95 mb-3 sm:mb-4 tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(253,251,235,0.25)]">
                Anti-Gravity Flavor
              </h2>
              <p className="text-xs sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-md mx-auto lg:mr-0 lg:ml-auto font-light leading-relaxed px-2 sm:px-0">
                Defying expectations and elevating taste beyond the physical limits of traditional brewing.
              </p>
            </div>
          </motion.div>
  
          {/* Section 4 */}
          <motion.div style={{ opacity: section4Opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <div className="max-w-3xl">
              <span className="text-[#D4A574] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs md:text-sm block mb-3 sm:mb-4 font-inter">
                Ready to Brew
              </span>
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-amber-50/95 mb-6 sm:mb-8 tracking-tight sm:tracking-tighter drop-shadow-[0_0_25px_rgba(253,251,235,0.35)]">
                Discover Your Blend
              </h2>
              <motion.a
                href="#blends"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(79, 156, 143, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] text-white rounded-full text-xs sm:text-sm md:text-lg font-bold font-inter shadow-2xl pointer-events-auto tracking-widest uppercase"
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
