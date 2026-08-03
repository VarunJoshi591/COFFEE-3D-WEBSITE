'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import { ChevronDown, RotateCcw, Play } from 'lucide-react';

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

  update(scrollVel: number, mouseVelX: number = 0, mouseOffsetX: number = 0) {
    this.life += this.decay;
    this.wobble += this.wobbleSpeed;

    // Mouse velocity and horizontal displacement influence steam draft vector
    const mouseDraft = mouseVelX * 4.0 + mouseOffsetX * 0.14;
    this.vx += (mouseDraft - this.vx) * 0.08;

    // Drifts up and wobbles naturally with sine dynamics + dynamic airflow draft
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

// 3D Interactive Floating Coffee Bean Particle System
class CoffeeBeanParticle {
  x: number;
  y: number;
  baseNormalizedX: number;
  baseNormalizedY: number;
  z: number; // Parallax depth layer (0.4 to 1.6)
  size: number;
  rotation: number;
  vRot: number;
  wobbleOffset: number;
  wobbleSpeed: number;

  constructor(normalizedX: number, normalizedY: number, z: number, size: number) {
    this.baseNormalizedX = normalizedX;
    this.baseNormalizedY = normalizedY;
    this.z = z;
    this.size = size;
    this.x = 0;
    this.y = 0;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.018;
    this.wobbleOffset = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.012 + Math.random() * 0.015;
  }

  update(
    canvasWidth: number,
    canvasHeight: number,
    targetMouseX: number,
    targetMouseY: number,
    mouseVelX: number,
    mouseVelY: number,
    time: number
  ) {
    const baseX = this.baseNormalizedX * canvasWidth;
    const baseY = this.baseNormalizedY * canvasHeight;

    // Organic floating hover sine movement
    const floatX = Math.sin(time * 0.022 + this.wobbleOffset) * 14 * this.z;
    const floatY = Math.cos(time * 0.026 + this.wobbleOffset) * 18 * this.z;

    // Parallax & Mouse follow magnetic physics offset
    const mouseAttractX = targetMouseX * canvasWidth * 0.22 * (this.z * 1.3);
    const mouseAttractY = targetMouseY * canvasHeight * 0.22 * (this.z * 1.3);

    // Mouse velocity dynamic momentum thrust
    const velocityAttractX = mouseVelX * 140 * (this.z * 0.9);
    const velocityAttractY = mouseVelY * 140 * (this.z * 0.9);

    const targetX = baseX + floatX + mouseAttractX + velocityAttractX;
    const targetY = baseY + floatY + mouseAttractY + velocityAttractY;

    if (this.x === 0 && this.y === 0) {
      this.x = targetX;
      this.y = targetY;
    } else {
      this.x += (targetX - this.x) * 0.07;
      this.y += (targetY - this.y) * 0.07;
    }

    // Spin speed reacts dynamically to cursor motion speed
    const mouseSpeed = Math.hypot(mouseVelX, mouseVelY);
    this.rotation += this.vRot + mouseSpeed * 0.08 * (this.z > 1 ? 1 : -1);
  }

  draw(ctx: CanvasRenderingContext2D, lightOffsetX: number, lightOffsetY: number) {
    ctx.save();

    // Dynamic 3D Drop Shadow underneath coffee bean
    const shadowX = this.x + lightOffsetX * 0.5 * this.z;
    const shadowY = this.y + 14 * this.z + lightOffsetY * 0.5 * this.z;

    ctx.save();
    ctx.translate(shadowX, shadowY);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 1.08, this.size * 0.65, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.5, 0.28 * this.z)})`;
    ctx.filter = `blur(${Math.max(3, 7 * this.z)}px)`;
    ctx.fill();
    ctx.restore();

    // Render Roasted Coffee Bean Body
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Outer Bean Contour
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.62, 0, 0, Math.PI * 2);

    const beanGrad = ctx.createLinearGradient(-this.size, -this.size * 0.6, this.size, this.size * 0.6);
    beanGrad.addColorStop(0, '#5A341F'); // Highlighted roasted curve
    beanGrad.addColorStop(0.35, '#391D10'); // Rich espresso body
    beanGrad.addColorStop(0.75, '#200F07'); // Deep roast shadow
    beanGrad.addColorStop(1, '#110603'); // Dark shadow border
    ctx.fillStyle = beanGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(212, 165, 116, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center Curved Crease (Iconic Coffee Bean Groove)
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.78, 0);
    ctx.bezierCurveTo(
      -this.size * 0.25, -this.size * 0.22,
      this.size * 0.25, this.size * 0.22,
      this.size * 0.78, 0
    );
    ctx.strokeStyle = '#0B0402';
    ctx.lineWidth = Math.max(1.5, this.size * 0.16);
    ctx.lineCap = 'round';
    ctx.stroke();

    // Inner Crema Groove Accent Line
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.65, -this.size * 0.04);
    ctx.bezierCurveTo(
      -this.size * 0.2, -this.size * 0.24,
      this.size * 0.2, this.size * 0.2,
      this.size * 0.65, 0.04
    );
    ctx.strokeStyle = 'rgba(212, 165, 116, 0.4)';
    ctx.lineWidth = Math.max(0.8, this.size * 0.06);
    ctx.stroke();

    // Top Gloss Highlight
    ctx.beginPath();
    ctx.ellipse(0, -this.size * 0.22, this.size * 0.65, this.size * 0.2, 0, Math.PI, 0, true);
    ctx.fillStyle = 'rgba(255, 235, 215, 0.16)';
    ctx.fill();

    ctx.restore();
  }
}

export default function HeroCanvasAnimation() {
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

    // Mouse coordinates & velocity configuration
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseVelX = 0;
    let mouseVelY = 0;

    // Particle arrays
    const steamParticles: SteamParticle[] = [];
    const splashParticles: SplashParticle[] = [];

    // Interactive floating coffee beans array
    const coffeeBeans: CoffeeBeanParticle[] = [
      new CoffeeBeanParticle(0.12, 0.22, 0.6, 16),
      new CoffeeBeanParticle(0.85, 0.18, 0.8, 18),
      new CoffeeBeanParticle(0.08, 0.65, 1.4, 26),
      new CoffeeBeanParticle(0.88, 0.72, 1.3, 24),
      new CoffeeBeanParticle(0.22, 0.82, 0.7, 17),
      new CoffeeBeanParticle(0.78, 0.35, 0.5, 14),
      new CoffeeBeanParticle(0.15, 0.42, 0.9, 20),
      new CoffeeBeanParticle(0.82, 0.55, 1.1, 22),
      new CoffeeBeanParticle(0.30, 0.14, 0.5, 15),
      new CoffeeBeanParticle(0.68, 0.85, 0.75, 19),
      new CoffeeBeanParticle(0.05, 0.35, 1.2, 25),
      new CoffeeBeanParticle(0.92, 0.38, 1.5, 27)
    ];

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

      // Compute mouse velocity
      const rawMouseVelX = targetMouseX - lastMouseX;
      const rawMouseVelY = targetMouseY - lastMouseY;
      lastMouseX = targetMouseX;
      lastMouseY = targetMouseY;

      mouseVelX += (rawMouseVelX - mouseVelX) * 0.25;
      mouseVelY += (rawMouseVelY - mouseVelY) * 0.25;

      // Smooth mouse position easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      const mouseOffsetX = currentMouseX * 45;
      const mouseOffsetY = currentMouseY * 45;
      const scrollOffsetY = scrollVal * -60;

      // Dynamic 3D Light Shadow offsets
      const shadowOffsetX = -currentMouseX * 50;
      const shadowOffsetY = -currentMouseY * 30;

      // Smooth 3D Cup Rotation angle (~8 degrees max tilt)
      const cupRotationAngle = currentMouseX * 0.14;

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
      bgGrad.addColorStop(0, '#26160E');
      bgGrad.addColorStop(0.5, '#160B07');
      bgGrad.addColorStop(1, '#0A0402');
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

      // Update & Draw Background Coffee Beans (Depth z <= 1.0)
      for (const bean of coffeeBeans) {
        bean.update(canvas.width, canvas.height, currentMouseX, currentMouseY, mouseVelX, mouseVelY, time);
        if (bean.z <= 1.0) {
          bean.draw(ctx, shadowOffsetX, shadowOffsetY);
        }
      }

      // CUP & POURING ENGINE CALCULATIONS
      const cupCenterX = canvas.width / 2 + mouseOffsetX;
      const cupCenterY = canvas.height * 0.56 + mouseOffsetY + scrollOffsetY;

      // Cup Geometry Dimensions
      const cupRadiusX = Math.min(140, canvas.width * 0.18);
      const cupRadiusY = cupRadiusX * 0.28;
      const cupHeight = cupRadiusX * 1.25;

      // Fill progress (0.0 to 1.0)
      const fillLevel = Math.min(1.0, rawProgress * 1.12);

      const liquidSurfaceY = (cupCenterY + cupHeight * 0.38) - fillLevel * (cupHeight * 0.76);
      const liquidRadiusX = cupRadiusX * (0.8 + 0.18 * fillLevel);
      const liquidRadiusY = cupRadiusY * (0.8 + 0.18 * fillLevel);

      // --- ROTATE CUP & SAUCER & LIQUID & STREAM LAYER TOGETHER ---
      ctx.save();
      ctx.translate(cupCenterX, cupCenterY);
      ctx.rotate(cupRotationAngle);
      ctx.translate(-cupCenterX, -cupCenterY);

      // --- DRAW SAUCER SHADOW & SAUCER ---
      ctx.save();
      // Dynamic Shadow shifting relative to mouse light offset
      ctx.beginPath();
      ctx.ellipse(
        cupCenterX + shadowOffsetX * 0.7,
        cupCenterY + cupHeight * 0.5 + 18 + shadowOffsetY * 0.5,
        cupRadiusX * 1.48,
        cupRadiusY * 1.22,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.filter = 'blur(14px)';
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
      ctx.ellipse(cupCenterX, cupCenterY - cupHeight * 0.38, cupRadiusX, cupRadiusY, 0, Math.PI, 0, true);
      ctx.bezierCurveTo(
        cupCenterX + cupRadiusX * 0.98, cupCenterY + cupHeight * 0.1,
        cupCenterX + cupRadiusX * 0.85, cupCenterY + cupHeight * 0.48,
        cupCenterX + cupRadiusX * 0.7, cupCenterY + cupHeight * 0.48
      );
      ctx.ellipse(cupCenterX, cupCenterY + cupHeight * 0.48, cupRadiusX * 0.7, cupRadiusY * 0.7, 0, 0, Math.PI, false);
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
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cupCenterX, liquidSurfaceY, liquidRadiusX, liquidRadiusY, 0, 0, Math.PI * 2);
        ctx.rect(cupCenterX - liquidRadiusX * 1.2, liquidSurfaceY, liquidRadiusX * 2.4, cupCenterY + cupHeight - liquidSurfaceY);
        
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
        ctx.clip();

        // LATTE ART BLOOM SIMULATION
        const artProgress = Math.max(0, Math.min(1.0, (rawProgress - 0.40) / 0.50));

        if (artProgress > 0.01) {
          ctx.save();
          const swirlAngle = (1 - artProgress) * 0.35 + Math.sin(time * 0.02) * 0.03;
          ctx.translate(cupCenterX, liquidSurfaceY);
          ctx.rotate(swirlAngle);
          ctx.scale(1, liquidRadiusY / liquidRadiusX);

          const maxScale = liquidRadiusX * 0.78 * Math.pow(artProgress, 0.7);

          ctx.beginPath();
          ctx.arc(0, 0, maxScale * 1.08, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212, 165, 116, 0.45)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, maxScale, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 253, 249, 0.92)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, maxScale * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = '#C8935A';
          ctx.fill();

          const numLeaves = 6;
          for (let l = numLeaves; l >= 1; l--) {
            const leafScale = (l / numLeaves) * maxScale * 0.85;
            const leafYOffset = (numLeaves - l) * (maxScale * 0.12) - maxScale * 0.1;

            ctx.save();
            ctx.translate(0, leafYOffset);
            
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

          ctx.beginPath();
          ctx.moveTo(0, -maxScale * 0.55);
          ctx.lineTo(0, maxScale * 0.45);
          ctx.strokeStyle = '#B8824A';
          ctx.lineWidth = Math.max(1, maxScale * 0.035);
          ctx.stroke();

          ctx.restore();

          ctx.restore();
        }

        // Concentric Ripple Effect
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

        ctx.restore();
      }

      ctx.restore();

      // --- DRAW CUP FRONT RIM HIGHLIGHT ---
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cupCenterX, cupCenterY - cupHeight * 0.38, cupRadiusX, cupRadiusY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 245, 235, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // --- 4. COFFEE & MILK POURING STREAMS ---
      const streamSourceX = cupCenterX + Math.sin(time * 0.03) * 3;
      const streamSourceY = cupCenterY - cupHeight * 1.8;
      const streamHitY = liquidSurfaceY;

      if (rawProgress > 0.01 && rawProgress < 0.52) {
        const streamAlpha = rawProgress < 0.06 ? rawProgress / 0.06 : (rawProgress > 0.46 ? (0.52 - rawProgress) / 0.06 : 1.0);
        ctx.save();
        ctx.globalAlpha = streamAlpha;

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

        ctx.beginPath();
        ctx.moveTo(streamSourceX - 1.5, streamSourceY);
        ctx.lineTo(cupCenterX - 1, streamHitY);
        ctx.lineTo(cupCenterX + 1, streamHitY);
        ctx.lineTo(streamSourceX + 1.5, streamSourceY);
        ctx.fillStyle = 'rgba(212, 165, 116, 0.6)';
        ctx.fill();

        ctx.restore();

        if (time % 2 === 0 && streamHitY <= cupCenterY + cupHeight * 0.45) {
          for (let p = 0; p < 2; p++) {
            splashParticles.push(new SplashParticle(cupCenterX, streamHitY, false));
          }
        }
      }

      if (rawProgress >= 0.44 && rawProgress < 0.94) {
        const milkAlpha = rawProgress < 0.50 ? (rawProgress - 0.44) / 0.06 : (rawProgress > 0.88 ? (0.94 - rawProgress) / 0.06 : 1.0);
        ctx.save();
        ctx.globalAlpha = milkAlpha;

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

        ctx.beginPath();
        ctx.moveTo(milkSourceX - 1, streamSourceY);
        ctx.lineTo(cupCenterX - 0.5, streamHitY);
        ctx.lineTo(cupCenterX + 0.5, streamHitY);
        ctx.lineTo(milkSourceX + 1, streamSourceY);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore();

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

      // --- 5. NATURAL STEAM MOVEMENT WITH DYNAMIC DIRECTION ---
      const steamEmitterX = cupCenterX;
      const steamEmitterY = fillLevel > 0.05 ? liquidSurfaceY - 5 : cupCenterY;

      const spawnInterval = Math.max(2, Math.round(5 - Math.abs(scrollVelVal) * 40));
      if (time % spawnInterval === 0 && steamParticles.length < 90) {
        steamParticles.push(new SteamParticle(steamEmitterX, steamEmitterY, scrollVelVal));
      }

      // Update & Draw Natural Steam responding to mouse velocity & offset draft
      for (let i = steamParticles.length - 1; i >= 0; i--) {
        const p = steamParticles[i];
        p.update(scrollVelVal, mouseVelX, currentMouseX);
        if (p.life >= 1) {
          steamParticles.splice(i, 1);
        } else {
          p.draw(ctx);
        }
      }

      ctx.restore(); // Restore cup layer rotation transform

      // Update & Draw Foreground Coffee Beans (Depth z > 1.0)
      for (const bean of coffeeBeans) {
        if (bean.z > 1.0) {
          bean.draw(ctx, shadowOffsetX, shadowOffsetY);
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
  }, [smoothProgress, scrollVelocity, pourProgressState, isPouring]);

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
        <div className="absolute top-24 left-6 md:left-12 z-30 flex items-center gap-3 pointer-events-auto">
          <button
            onClick={resetPourAnimation}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A0F0A]/70 hover:bg-[#1A0F0A]/90 backdrop-blur-md border border-[#D4A574]/40 rounded-full text-xs font-semibold text-[#F5E6D3] hover:text-white transition-all duration-300 shadow-xl group hover:border-[#4F9C8F]"
            title="Re-pour Coffee & Re-create Latte Art"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#4F9C8F] group-hover:rotate-180 transition-transform duration-500" />
            <span>Re-pour Coffee</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1A0F0A]/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-medium text-[#C9B8A0]">
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
          <motion.div style={{ opacity: section1Opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-20 md:pt-24 text-center">
            <div className="max-w-3xl flex flex-col items-center">
              <span className="text-[#4F9C8F] font-extrabold tracking-[0.3em] uppercase text-xs md:text-sm block mb-4 font-inter">
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
