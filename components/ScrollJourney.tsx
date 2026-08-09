'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { useScrollJourney, JOURNEY_ACTS, JOURNEY_HEIGHT_VH, subProgress } from './useScrollJourney';
import ScrollScene from './ScrollScene';
import ScrollProgressIndicator from './ScrollProgressIndicator';
import ProductShowcase from './ProductShowcase';
import FeatureSection from './FeatureSection';
import BrewingGuide from './BrewingGuide';
import FinalCTA from './FinalCTA';
import { ChevronDown } from 'lucide-react';

/* ═══════════════════════════════════════════
   PARTICLE CLASSES (steam, beans, bokeh)
   ═══════════════════════════════════════════ */

class SteamParticle {
  x: number; y: number; vx: number; vy: number;
  size: number; maxSize: number; alpha: number;
  life: number; decay: number; wobble: number; wobbleSpeed: number;

  constructor(x: number, y: number, scrollVel: number) {
    this.x = x + (Math.random() * 40 - 20);
    this.y = y + (Math.random() * 10 - 5);
    this.vx = Math.random() * 0.6 - 0.3;
    this.vy = -(1.0 + Math.random() * 1.4) - Math.abs(scrollVel) * 8;
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
    this.x += this.vx + Math.sin(this.wobble) * 0.6 + scrollVel * 3;
    this.y += this.vy - Math.abs(scrollVel) * 3;
    this.size += (this.maxSize - this.size) * 0.014;
    if (this.life < 0.25) this.alpha = (this.life / 0.25) * 0.22;
    else this.alpha = Math.max(0, 0.22 * (1 - (this.life - 0.25) / 0.75));
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

class BeanParticle {
  x: number; y: number; vx: number; vy: number;
  size: number; rot: number; vRot: number;
  alpha: number; gravity: number;

  constructor(x: number, y: number) {
    this.x = x + (Math.random() - 0.5) * 200;
    this.y = y - Math.random() * 100;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = 1 + Math.random() * 2;
    this.size = 6 + Math.random() * 8;
    this.rot = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.08;
    this.alpha = 0.7 + Math.random() * 0.3;
    this.gravity = 0.04;
  }

  update(canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rot += this.vRot;
    if (this.y > canvasHeight + 20) {
      this.y = -20;
      this.vy = 1 + Math.random() * 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
    const bGrad = ctx.createLinearGradient(-this.size, 0, this.size, 0);
    bGrad.addColorStop(0, '#5C3622');
    bGrad.addColorStop(0.5, '#3A1E11');
    bGrad.addColorStop(1, '#1A0C06');
    ctx.fillStyle = bGrad;
    ctx.fill();
    // Crease
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.65, 0);
    ctx.lineTo(this.size * 0.65, 0);
    ctx.strokeStyle = 'rgba(14, 5, 2, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}

class BokehParticle {
  x: number; y: number; size: number;
  alpha: number; hue: number; drift: number;
  speed: number; phase: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = 8 + Math.random() * 35;
    this.alpha = 0.04 + Math.random() * 0.12;
    this.hue = Math.random() > 0.5 ? 28 : 170; // warm amber or teal
    this.drift = (Math.random() - 0.5) * 0.3;
    this.speed = 0.1 + Math.random() * 0.3;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(time: number) {
    this.x += this.drift;
    this.y -= this.speed;
    this.phase += 0.01;
    if (this.y < -this.size * 2) this.y += (this.size * 2 + window.innerHeight + 40);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const pulseAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.phase));
    ctx.save();
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    if (this.hue === 28) {
      grad.addColorStop(0, `rgba(212, 165, 116, ${pulseAlpha})`);
      grad.addColorStop(1, `rgba(212, 165, 116, 0)`);
    } else {
      grad.addColorStop(0, `rgba(79, 156, 143, ${pulseAlpha})`);
      grad.addColorStop(1, `rgba(79, 156, 143, 0)`);
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class SplashParticle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; color: string; gravity: number; life: number;

  constructor(x: number, y: number, isMilk: boolean) {
    this.x = x + (Math.random() * 8 - 4);
    this.y = y + (Math.random() * 4 - 2);
    const angle = (Math.random() * Math.PI) - Math.PI / 2;
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
    this.x += this.vx; this.y += this.vy;
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

/* ═══════════════════════════════════════════
   FRAME SEQUENCE LOADER (for Enter Shop act)
   ═══════════════════════════════════════════ */

function preloadFrames(count: number): HTMLImageElement[] {
  const images: HTMLImageElement[] = [];
  for (let i = 0; i < count; i++) {
    const img = new Image();
    img.src = `/frames/frame_${i}.webp`;
    images.push(img);
  }
  return images;
}

/* ═══════════════════════════════════════════
   CANVAS SCENE DRAWING FUNCTIONS
   ═══════════════════════════════════════════ */

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  colors: { canvasBg1: string; canvasBg2: string; canvasBg3: string },
  mouseX: number, mouseY: number,
  warmth: number, // 0–1, higher = warmer amber tones
) {
  ctx.save();
  const bgGrad = ctx.createRadialGradient(
    w / 2 + mouseX * 0.2, h * 0.45 + mouseY * 0.2, 0,
    w / 2, h / 2, Math.max(w, h) * 0.75
  );
  bgGrad.addColorStop(0, colors.canvasBg1);
  bgGrad.addColorStop(0.5, colors.canvasBg2);
  bgGrad.addColorStop(1, colors.canvasBg3);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Warm overlay
  if (warmth > 0) {
    ctx.fillStyle = `rgba(60, 30, 10, ${warmth * 0.3})`;
    ctx.fillRect(0, 0, w, h);
  }

  // Vignette
  const vigGrad = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.2,
    w / 2, h / 2, Math.max(w, h) * 0.8
  );
  vigGrad.addColorStop(0, 'rgba(26, 15, 10, 0.15)');
  vigGrad.addColorStop(0.65, 'rgba(26, 15, 10, 0.6)');
  vigGrad.addColorStop(1, '#130A06');
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** Draw the hero cup with pour animation (from original HeroCanvasAnimation) */
function drawHeroCup(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  mouseX: number, mouseY: number,
  pourProgress: number, // 0–1 pour timeline
  time: number,
  scrollVel: number,
  steamParticles: SteamParticle[],
  splashParticles: SplashParticle[],
) {
  const isMobile = w < 640;
  const cupCenterX = w / 2 + mouseX;
  const cupCenterY = h * (isMobile ? 0.53 : 0.56) + mouseY;
  const cupRadiusX = Math.min(140, Math.max(82, w * (isMobile ? 0.28 : 0.18)));
  const cupRadiusY = cupRadiusX * 0.28;
  const cupHeight = cupRadiusX * 1.25;

  const fillLevel = Math.min(1.0, pourProgress * 1.12);
  const liquidSurfaceY = (cupCenterY + cupHeight * 0.38) - fillLevel * (cupHeight * 0.76);
  const liquidRadiusX = cupRadiusX * (0.8 + 0.18 * fillLevel);
  const liquidRadiusY = cupRadiusY * (0.8 + 0.18 * fillLevel);

  // Saucer shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cupCenterX, cupCenterY + cupHeight * 0.5 + 18, cupRadiusX * 1.45, cupRadiusY * 1.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.filter = 'blur(12px)';
  ctx.fill();
  ctx.filter = 'none';

  // Saucer
  ctx.beginPath();
  ctx.ellipse(cupCenterX, cupCenterY + cupHeight * 0.5, cupRadiusX * 1.4, cupRadiusY * 1.1, 0, 0, Math.PI * 2);
  const sGrad = ctx.createLinearGradient(cupCenterX - cupRadiusX, 0, cupCenterX + cupRadiusX, 0);
  sGrad.addColorStop(0, '#2A1D17'); sGrad.addColorStop(0.5, '#4A342B'); sGrad.addColorStop(1, '#1C120D');
  ctx.fillStyle = sGrad;
  ctx.fill();
  ctx.strokeStyle = '#6E4D3E'; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();

  // Handle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cupCenterX + cupRadiusX * 0.95, cupCenterY, cupHeight * 0.28, -Math.PI * 0.45, Math.PI * 0.45);
  ctx.lineWidth = cupRadiusX * 0.18;
  const hGrad = ctx.createLinearGradient(cupCenterX + cupRadiusX, 0, cupCenterX + cupRadiusX * 1.4, 0);
  hGrad.addColorStop(0, '#3A261C'); hGrad.addColorStop(0.5, '#5A3E30'); hGrad.addColorStop(1, '#23140C');
  ctx.strokeStyle = hGrad; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();

  // Cup body
  ctx.save();
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

  const cupGrad = ctx.createLinearGradient(cupCenterX - cupRadiusX, cupCenterY, cupCenterX + cupRadiusX, cupCenterY);
  cupGrad.addColorStop(0, '#1E120B'); cupGrad.addColorStop(0.2, '#3D281D');
  cupGrad.addColorStop(0.5, '#54382A'); cupGrad.addColorStop(0.8, '#322016'); cupGrad.addColorStop(1, '#150A05');
  ctx.fillStyle = cupGrad; ctx.fill();
  ctx.strokeStyle = 'rgba(212, 165, 116, 0.3)'; ctx.lineWidth = 1.5; ctx.stroke();

  // Inner cavity clip
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

  // Inner wall
  const iwGrad = ctx.createRadialGradient(cupCenterX, cupCenterY, cupRadiusX * 0.2, cupCenterX, cupCenterY, cupRadiusX * 1.1);
  iwGrad.addColorStop(0, '#2D1B12'); iwGrad.addColorStop(1, '#0F0704');
  ctx.fillStyle = iwGrad;
  ctx.fillRect(cupCenterX - cupRadiusX * 1.2, cupCenterY - cupHeight, cupRadiusX * 2.4, cupHeight * 2);

  // Liquid
  if (fillLevel > 0.01) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cupCenterX, liquidSurfaceY, liquidRadiusX, liquidRadiusY, 0, 0, Math.PI * 2);
    ctx.rect(cupCenterX - liquidRadiusX * 1.2, liquidSurfaceY, liquidRadiusX * 2.4, cupCenterY + cupHeight - liquidSurfaceY);
    const lGrad = ctx.createLinearGradient(0, liquidSurfaceY, 0, cupCenterY + cupHeight);
    lGrad.addColorStop(0, '#4A2818'); lGrad.addColorStop(0.4, '#2E170C'); lGrad.addColorStop(1, '#1A0C06');
    ctx.fillStyle = lGrad; ctx.fill();
    ctx.restore();

    // Surface
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cupCenterX, liquidSurfaceY, liquidRadiusX, liquidRadiusY, 0, 0, Math.PI * 2);
    const sfGrad = ctx.createRadialGradient(cupCenterX, liquidSurfaceY, 0, cupCenterX, liquidSurfaceY, liquidRadiusX);
    sfGrad.addColorStop(0, '#663B23'); sfGrad.addColorStop(0.6, '#422212');
    sfGrad.addColorStop(0.9, '#2B1409'); sfGrad.addColorStop(1, '#190A04');
    ctx.fillStyle = sfGrad; ctx.fill();
    ctx.clip();

    // Latte art
    const artProgress = Math.max(0, Math.min(1.0, (pourProgress - 0.40) / 0.50));
    if (artProgress > 0.01) {
      ctx.save();
      const swirlAngle = (1 - artProgress) * 0.35 + Math.sin(time * 0.02) * 0.03;
      ctx.translate(cupCenterX, liquidSurfaceY);
      ctx.rotate(swirlAngle);
      ctx.scale(1, liquidRadiusY / liquidRadiusX);
      const maxScale = liquidRadiusX * 0.78 * Math.pow(artProgress, 0.7);

      // Crema ring
      ctx.beginPath(); ctx.arc(0, 0, maxScale * 1.08, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 165, 116, 0.45)'; ctx.fill();
      // Foam
      ctx.beginPath(); ctx.arc(0, 0, maxScale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 253, 249, 0.92)'; ctx.fill();
      // Espresso swirl
      ctx.beginPath(); ctx.arc(0, 0, maxScale * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = '#C8935A'; ctx.fill();

      // Rosetta leaves
      const numLeaves = 6;
      for (let l = numLeaves; l >= 1; l--) {
        const ls = (l / numLeaves) * maxScale * 0.85;
        const ly = (numLeaves - l) * (maxScale * 0.12) - maxScale * 0.1;
        ctx.save(); ctx.translate(0, ly);
        ctx.beginPath();
        ctx.moveTo(0, ls * 0.5);
        ctx.bezierCurveTo(ls * 0.9, -ls * 0.2, ls * 0.7, -ls * 0.8, 0, -ls * 0.6);
        ctx.bezierCurveTo(-ls * 0.7, -ls * 0.8, -ls * 0.9, -ls * 0.2, 0, ls * 0.5);
        ctx.fillStyle = l % 2 === 0 ? 'rgba(255, 253, 249, 0.96)' : 'rgba(247, 238, 226, 0.92)';
        ctx.fill();
        ctx.restore();
      }

      // Heart crown
      const hs = maxScale * 0.28;
      ctx.save(); ctx.translate(0, -maxScale * 0.42);
      ctx.beginPath(); ctx.moveTo(0, hs * 0.3);
      ctx.bezierCurveTo(hs * 0.6, -hs * 0.6, hs * 1.1, hs * 0.2, 0, hs * 0.9);
      ctx.bezierCurveTo(-hs * 1.1, hs * 0.2, -hs * 0.6, -hs * 0.6, 0, hs * 0.3);
      ctx.fillStyle = '#FFFDF9'; ctx.fill();

      // Central line
      ctx.beginPath(); ctx.moveTo(0, -maxScale * 0.55); ctx.lineTo(0, maxScale * 0.45);
      ctx.strokeStyle = '#B8824A'; ctx.lineWidth = Math.max(1, maxScale * 0.035); ctx.stroke();
      ctx.restore(); ctx.restore();
    }

    // Ripple
    if (pourProgress > 0.02 && pourProgress < 0.92) {
      const rr = (time * 1.8) % (liquidRadiusX * 0.7);
      const ra = Math.max(0, 1 - (rr / (liquidRadiusX * 0.7))) * 0.4;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cupCenterX, liquidSurfaceY, rr, rr * (liquidRadiusY / liquidRadiusX), 0, 0, Math.PI * 2);
      ctx.strokeStyle = pourProgress > 0.45 ? `rgba(255, 253, 249, ${ra})` : `rgba(212, 165, 116, ${ra})`;
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  ctx.restore(); // inner cavity clip
  
  // Rim
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cupCenterX, cupCenterY - cupHeight * 0.38, cupRadiusX, cupRadiusY, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 245, 235, 0.4)'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.restore();

  // Pour streams
  const streamSrcX = cupCenterX + Math.sin(time * 0.03) * 3;
  const streamSrcY = cupCenterY - cupHeight * 1.8;
  const streamHitY = liquidSurfaceY;

  // Espresso stream
  if (pourProgress > 0.01 && pourProgress < 0.52) {
    const sa = pourProgress < 0.06 ? pourProgress / 0.06 : (pourProgress > 0.46 ? (0.52 - pourProgress) / 0.06 : 1.0);
    ctx.save(); ctx.globalAlpha = sa;
    ctx.beginPath();
    ctx.moveTo(streamSrcX - 6, streamSrcY);
    ctx.quadraticCurveTo(streamSrcX - 2, (streamSrcY + streamHitY) / 2, cupCenterX - 4, streamHitY);
    ctx.lineTo(cupCenterX + 4, streamHitY);
    ctx.quadraticCurveTo(streamSrcX + 2, (streamSrcY + streamHitY) / 2, streamSrcX + 6, streamSrcY);
    ctx.closePath();
    const esGrad = ctx.createLinearGradient(streamSrcX, streamSrcY, cupCenterX, streamHitY);
    esGrad.addColorStop(0, '#5C3119'); esGrad.addColorStop(0.5, '#3B1E0F'); esGrad.addColorStop(1, '#241107');
    ctx.fillStyle = esGrad; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(streamSrcX - 1.5, streamSrcY);
    ctx.lineTo(cupCenterX - 1, streamHitY); ctx.lineTo(cupCenterX + 1, streamHitY);
    ctx.lineTo(streamSrcX + 1.5, streamSrcY);
    ctx.fillStyle = 'rgba(212, 165, 116, 0.6)'; ctx.fill();
    ctx.restore();
    if (time % 2 === 0 && streamHitY <= cupCenterY + cupHeight * 0.45) {
      for (let p = 0; p < 2; p++) splashParticles.push(new SplashParticle(cupCenterX, streamHitY, false));
    }
  }

  // Milk stream
  if (pourProgress >= 0.44 && pourProgress < 0.94) {
    const ma = pourProgress < 0.50 ? (pourProgress - 0.44) / 0.06 : (pourProgress > 0.88 ? (0.94 - pourProgress) / 0.06 : 1.0);
    ctx.save(); ctx.globalAlpha = ma;
    const msX = streamSrcX + 4;
    ctx.beginPath();
    ctx.moveTo(msX - 4.5, streamSrcY);
    ctx.quadraticCurveTo(msX - 1, (streamSrcY + streamHitY) / 2, cupCenterX - 3, streamHitY);
    ctx.lineTo(cupCenterX + 3, streamHitY);
    ctx.quadraticCurveTo(msX + 1, (streamSrcY + streamHitY) / 2, msX + 4.5, streamSrcY);
    ctx.closePath();
    const mkGrad = ctx.createLinearGradient(msX, streamSrcY, cupCenterX, streamHitY);
    mkGrad.addColorStop(0, '#FFFDF9'); mkGrad.addColorStop(0.6, '#F5EBE1'); mkGrad.addColorStop(1, '#E6D7C8');
    ctx.fillStyle = mkGrad; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(msX - 1, streamSrcY);
    ctx.lineTo(cupCenterX - 0.5, streamHitY); ctx.lineTo(cupCenterX + 0.5, streamHitY);
    ctx.lineTo(msX + 1, streamSrcY);
    ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.restore();
    if (time % 2 === 0 && streamHitY <= cupCenterY + cupHeight * 0.45) {
      for (let p = 0; p < 2; p++) splashParticles.push(new SplashParticle(cupCenterX, streamHitY, true));
    }
  }

  // Splash particles
  for (let i = splashParticles.length - 1; i >= 0; i--) {
    splashParticles[i].update();
    if (splashParticles[i].life <= 0) splashParticles.splice(i, 1);
    else splashParticles[i].draw(ctx);
  }

  // Steam
  const steamX = cupCenterX;
  const steamY = fillLevel > 0.05 ? liquidSurfaceY - 5 : cupCenterY;
  const interval = Math.max(2, Math.round(5 - Math.abs(scrollVel) * 40));
  if (time % interval === 0 && steamParticles.length < 90) {
    steamParticles.push(new SteamParticle(steamX, steamY, scrollVel));
  }
  for (let i = steamParticles.length - 1; i >= 0; i--) {
    steamParticles[i].update(scrollVel);
    if (steamParticles[i].life >= 1) steamParticles.splice(i, 1);
    else steamParticles[i].draw(ctx);
  }
}

/** Roasting room: rotating drum, heat shimmer, falling beans */
function drawRoastingScene(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  sceneProgress: number,
  time: number,
  beanParticles: BeanParticle[],
) {
  const cx = w / 2;
  const cy = h * 0.5;

  // Warm amber glow
  const glowAlpha = 0.15 + 0.05 * Math.sin(time * 0.02);
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.6);
  glow.addColorStop(0, `rgba(200, 120, 40, ${glowAlpha})`);
  glow.addColorStop(0.5, `rgba(140, 70, 20, ${glowAlpha * 0.4})`);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Roaster drum
  const drumW = Math.min(280, w * 0.35);
  const drumH = drumW * 0.6;
  const rotation = time * 0.015;

  ctx.save();
  ctx.translate(cx, cy);

  // Drum body
  ctx.beginPath();
  ctx.ellipse(0, 0, drumW / 2, drumH / 2, 0, 0, Math.PI * 2);
  const drumGrad = ctx.createLinearGradient(-drumW / 2, 0, drumW / 2, 0);
  drumGrad.addColorStop(0, '#2A1C15');
  drumGrad.addColorStop(0.3, '#6E4D3E');
  drumGrad.addColorStop(0.5, '#8B6654');
  drumGrad.addColorStop(0.7, '#5A3E30');
  drumGrad.addColorStop(1, '#1C110B');
  ctx.fillStyle = drumGrad;
  ctx.fill();
  ctx.strokeStyle = '#9E7A66';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Drum window
  ctx.beginPath();
  ctx.ellipse(0, 0, drumW * 0.25, drumH * 0.25, 0, 0, Math.PI * 2);
  const windowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, drumW * 0.25);
  windowGrad.addColorStop(0, 'rgba(255, 140, 40, 0.6)');
  windowGrad.addColorStop(0.6, 'rgba(180, 80, 20, 0.4)');
  windowGrad.addColorStop(1, 'rgba(60, 30, 10, 0.8)');
  ctx.fillStyle = windowGrad;
  ctx.fill();

  // Rotation lines inside drum
  for (let i = 0; i < 4; i++) {
    const angle = rotation + (i * Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * drumW * 0.1, Math.sin(angle) * drumH * 0.1);
    ctx.lineTo(Math.cos(angle) * drumW * 0.22, Math.sin(angle) * drumH * 0.22);
    ctx.strokeStyle = 'rgba(255, 200, 100, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Legs
  ctx.beginPath();
  ctx.moveTo(-drumW * 0.3, drumH / 2);
  ctx.lineTo(-drumW * 0.35, drumH / 2 + 40);
  ctx.moveTo(drumW * 0.3, drumH / 2);
  ctx.lineTo(drumW * 0.35, drumH / 2 + 40);
  ctx.strokeStyle = '#5A3E30';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();

  // Heat shimmer (wavy lines above drum)
  ctx.save();
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 5; i++) {
    const shimmerY = cy - drumH / 2 - 30 - i * 25;
    ctx.beginPath();
    for (let x = cx - drumW * 0.4; x < cx + drumW * 0.4; x += 3) {
      const sy = shimmerY + Math.sin((x + time * 2) * 0.03 + i) * 6;
      if (x === cx - drumW * 0.4) ctx.moveTo(x, sy);
      else ctx.lineTo(x, sy);
    }
    ctx.strokeStyle = `rgba(255, 180, 80, ${0.3 - i * 0.05})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // Bean particles
  for (const bean of beanParticles) {
    bean.update(h);
    bean.draw(ctx);
  }
}

/** Coffee machine / espresso extraction scene */
function drawMachineScene(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  sceneProgress: number,
  time: number,
  steamParticles: SteamParticle[],
  scrollVel: number,
) {
  const cx = w / 2;
  const cy = h * 0.45;
  const machineW = Math.min(300, w * 0.4);
  const machineH = machineW * 1.2;

  // Machine body
  ctx.save();
  ctx.translate(cx, cy);

  // Main body
  ctx.beginPath();
  ctx.roundRect(-machineW / 2, -machineH / 2, machineW, machineH, 12);
  const mGrad = ctx.createLinearGradient(-machineW / 2, 0, machineW / 2, 0);
  mGrad.addColorStop(0, '#1E1210');
  mGrad.addColorStop(0.2, '#3D2820');
  mGrad.addColorStop(0.5, '#4A3228');
  mGrad.addColorStop(0.8, '#2E1C16');
  mGrad.addColorStop(1, '#150C08');
  ctx.fillStyle = mGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 165, 116, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Group head
  ctx.beginPath();
  ctx.roundRect(-machineW * 0.2, machineH * 0.15, machineW * 0.4, machineH * 0.12, 4);
  ctx.fillStyle = '#5A3E30';
  ctx.fill();
  ctx.strokeStyle = '#9E7A66';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Portafilter
  const pfY = machineH * 0.27;
  ctx.beginPath();
  ctx.moveTo(-machineW * 0.15, pfY);
  ctx.lineTo(machineW * 0.15, pfY);
  ctx.lineTo(machineW * 0.12, pfY + 20);
  ctx.lineTo(-machineW * 0.12, pfY + 20);
  ctx.closePath();
  ctx.fillStyle = '#3A261C';
  ctx.fill();
  ctx.strokeStyle = '#6E4D3E';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Handle
  ctx.beginPath();
  ctx.moveTo(machineW * 0.15, pfY + 10);
  ctx.lineTo(machineW * 0.32, pfY + 10);
  ctx.strokeStyle = '#2A1D17';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Extraction stream
  const extractProgress = subProgress(sceneProgress, 0.2, 0.85);
  if (extractProgress > 0) {
    const streamAlpha = extractProgress < 0.1 ? extractProgress / 0.1 : (extractProgress > 0.9 ? (1 - extractProgress) / 0.1 : 1);
    ctx.save();
    ctx.globalAlpha = streamAlpha;

    // Twin streams
    for (const offset of [-8, 8]) {
      ctx.beginPath();
      ctx.moveTo(offset - 1.5, pfY + 20);
      ctx.lineTo(offset - 1, pfY + 70);
      ctx.lineTo(offset + 1, pfY + 70);
      ctx.lineTo(offset + 1.5, pfY + 20);
      ctx.closePath();
      const stGrad = ctx.createLinearGradient(0, pfY + 20, 0, pfY + 70);
      stGrad.addColorStop(0, '#5C3119');
      stGrad.addColorStop(0.5, '#D4A574');
      stGrad.addColorStop(1, '#3B1E0F');
      ctx.fillStyle = stGrad;
      ctx.fill();
    }

    ctx.restore();
  }

  // Gauge
  ctx.beginPath();
  ctx.arc(0, -machineH * 0.28, machineW * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#1A0F0A';
  ctx.fill();
  ctx.strokeStyle = '#9E7A66';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Gauge needle
  const needleAngle = -Math.PI * 0.7 + sceneProgress * Math.PI * 0.9;
  ctx.beginPath();
  ctx.moveTo(0, -machineH * 0.28);
  ctx.lineTo(
    Math.cos(needleAngle) * machineW * 0.08,
    -machineH * 0.28 + Math.sin(needleAngle) * machineW * 0.08
  );
  ctx.strokeStyle = '#E85C3A';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Buttons
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(-machineW * 0.2 + i * machineW * 0.2, -machineH * 0.1, 6, 0, Math.PI * 2);
    ctx.fillStyle = i === 1 && extractProgress > 0 ? '#4F9C8F' : '#3A261C';
    ctx.fill();
    ctx.strokeStyle = '#6E4D3E';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Cup underneath machine
  const cupY = pfY + 60;
  ctx.beginPath();
  ctx.ellipse(0, cupY + 25, 25, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#2A1D17';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, cupY, 22, 6, 0, Math.PI, 0, true);
  ctx.bezierCurveTo(22, cupY + 10, 18, cupY + 25, 16, cupY + 25);
  ctx.ellipse(0, cupY + 25, 16, 5, 0, 0, Math.PI, false);
  ctx.bezierCurveTo(-18, cupY + 25, -22, cupY + 10, -22, cupY);
  ctx.closePath();
  const cGrad = ctx.createLinearGradient(-22, cupY, 22, cupY);
  cGrad.addColorStop(0, '#1E120B'); cGrad.addColorStop(0.5, '#4A3228'); cGrad.addColorStop(1, '#150A05');
  ctx.fillStyle = cGrad;
  ctx.fill();

  // Crema in small cup
  if (extractProgress > 0.3) {
    const cremaLevel = Math.min(1, (extractProgress - 0.3) / 0.5);
    const cremaY = cupY + 20 - cremaLevel * 18;
    ctx.beginPath();
    ctx.ellipse(0, cremaY, 14 * (0.6 + 0.4 * cremaLevel), 4 * (0.6 + 0.4 * cremaLevel), 0, 0, Math.PI * 2);
    const crGrad = ctx.createRadialGradient(0, cremaY, 0, 0, cremaY, 14);
    crGrad.addColorStop(0, '#D4A574');
    crGrad.addColorStop(0.7, '#8B5A35');
    crGrad.addColorStop(1, '#4A2818');
    ctx.fillStyle = crGrad;
    ctx.fill();
  }

  ctx.restore();

  // Steam from machine
  if (sceneProgress > 0.1) {
    const steamX = cx;
    const steamY = cy - machineH / 2 - 10;
    if (time % 4 === 0 && steamParticles.length < 60) {
      steamParticles.push(new SteamParticle(steamX, steamY, scrollVel));
    }
  }
}

/** Table scene: top-down cup view with latte art, ambient bokeh */
function drawTableScene(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  sceneProgress: number,
  time: number,
  bokehParticles: BokehParticle[],
) {
  const cx = w / 2;
  const cy = h * 0.48;

  // Warm table surface
  ctx.save();
  const tableGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
  tableGrad.addColorStop(0, 'rgba(60, 35, 20, 0.4)');
  tableGrad.addColorStop(0.5, 'rgba(30, 18, 10, 0.2)');
  tableGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = tableGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Table wood grain lines
  ctx.save();
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 15; i++) {
    const grainY = cy - 100 + i * 18;
    ctx.beginPath();
    for (let x = 0; x < w; x += 4) {
      const gy = grainY + Math.sin(x * 0.01 + i * 0.5) * 3;
      if (x === 0) ctx.moveTo(x, gy);
      else ctx.lineTo(x, gy);
    }
    ctx.strokeStyle = '#D4A574';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  // Top-down cup view (large circular rim)
  const cupRadius = Math.min(120, w * 0.16);
  const cupScale = 0.6 + 0.4 * Math.min(1, sceneProgress / 0.3);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(cupScale, cupScale);

  // Saucer
  ctx.beginPath();
  ctx.arc(0, 0, cupRadius * 1.5, 0, Math.PI * 2);
  const saucerGrad = ctx.createRadialGradient(0, 0, cupRadius * 0.8, 0, 0, cupRadius * 1.5);
  saucerGrad.addColorStop(0, '#4A342B');
  saucerGrad.addColorStop(1, '#2A1D17');
  ctx.fillStyle = saucerGrad;
  ctx.fill();
  ctx.strokeStyle = '#6E4D3E';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Outer cup rim
  ctx.beginPath();
  ctx.arc(0, 0, cupRadius, 0, Math.PI * 2);
  const rimGrad = ctx.createLinearGradient(-cupRadius, 0, cupRadius, 0);
  rimGrad.addColorStop(0, '#3D281D');
  rimGrad.addColorStop(0.5, '#54382A');
  rimGrad.addColorStop(1, '#2A1810');
  ctx.fillStyle = rimGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 245, 235, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Inner coffee surface
  const innerR = cupRadius * 0.85;
  ctx.beginPath();
  ctx.arc(0, 0, innerR, 0, Math.PI * 2);
  const coffeeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, innerR);
  coffeeGrad.addColorStop(0, '#663B23');
  coffeeGrad.addColorStop(0.6, '#422212');
  coffeeGrad.addColorStop(1, '#2B1409');
  ctx.fillStyle = coffeeGrad;
  ctx.fill();
  ctx.clip();

  // Latte art from top
  const artScale = innerR * 0.8;
  const artRot = Math.sin(time * 0.005) * 0.03;
  ctx.save();
  ctx.rotate(artRot);

  // Crema
  ctx.beginPath(); ctx.arc(0, 0, artScale * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(212, 165, 116, 0.4)'; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, artScale * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 253, 249, 0.9)'; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, artScale * 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#C8935A'; ctx.fill();

  // Rosetta
  for (let l = 6; l >= 1; l--) {
    const ls = (l / 6) * artScale * 0.82;
    const ly = (6 - l) * (artScale * 0.11) - artScale * 0.08;
    ctx.save(); ctx.translate(0, ly);
    ctx.beginPath(); ctx.moveTo(0, ls * 0.5);
    ctx.bezierCurveTo(ls * 0.9, -ls * 0.2, ls * 0.7, -ls * 0.8, 0, -ls * 0.6);
    ctx.bezierCurveTo(-ls * 0.7, -ls * 0.8, -ls * 0.9, -ls * 0.2, 0, ls * 0.5);
    ctx.fillStyle = l % 2 === 0 ? 'rgba(255, 253, 249, 0.96)' : 'rgba(247, 238, 226, 0.92)';
    ctx.fill(); ctx.restore();
  }
  // Heart
  const hs = artScale * 0.25;
  ctx.save(); ctx.translate(0, -artScale * 0.4);
  ctx.beginPath(); ctx.moveTo(0, hs * 0.3);
  ctx.bezierCurveTo(hs * 0.6, -hs * 0.6, hs * 1.1, hs * 0.2, 0, hs * 0.9);
  ctx.bezierCurveTo(-hs * 1.1, hs * 0.2, -hs * 0.6, -hs * 0.6, 0, hs * 0.3);
  ctx.fillStyle = '#FFFDF9'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -artScale * 0.15);
  ctx.lineTo(0, artScale * 0.5);
  ctx.strokeStyle = '#B8824A'; ctx.lineWidth = Math.max(1, artScale * 0.03); ctx.stroke();
  ctx.restore();
  ctx.restore();

  // Handle (side view hint)
  ctx.restore(); // exit clip
  ctx.beginPath();
  ctx.arc(cupRadius * 1.05, 0, 16, -0.5, 0.5);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#3A261C';
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore(); // exit translate/scale

  // Bokeh particles
  for (const b of bokehParticles) {
    b.update(time);
    b.draw(ctx);
  }
}

/* ═══════════════════════════════════════════
   FRAME SEQUENCE RENDERER (Enter Shop)
   ═══════════════════════════════════════════ */

function drawFrameSequence(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  frames: HTMLImageElement[],
  sceneProgress: number,
) {
  if (frames.length === 0) return;
  const idx = Math.min(frames.length - 1, Math.floor(sceneProgress * (frames.length - 1)));
  const img = frames[idx];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  // Cover-fit the frame
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

/* ═══════════════════════════════════════════
   MAIN SCROLL JOURNEY COMPONENT
   ═══════════════════════════════════════════ */

interface ScrollJourneyProps {
  onAddToCart?: () => void;
}

export default function ScrollJourney({ onAddToCart }: ScrollJourneyProps) {
  const { colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const journey = useScrollJourney(scrollYProgress);

  // Preload frame sequence
  useEffect(() => {
    framesRef.current = preloadFrames(120);
  }, []);

  // ── Canvas animation loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let currentMouseX = 0, currentMouseY = 0;

    // Persistent particle arrays
    const steamParticles: SteamParticle[] = [];
    const splashParticles: SplashParticle[] = [];
    const beanParticles: BeanParticle[] = [];
    const bokehParticles: BokehParticle[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 35;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 35;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reinitialize bokeh on resize
      bokehParticles.length = 0;
      for (let i = 0; i < 30; i++) {
        bokehParticles.push(new BokehParticle(canvas.width, canvas.height));
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize beans
    for (let i = 0; i < 18; i++) {
      beanParticles.push(new BeanParticle(canvas.width / 2, Math.random() * canvas.height));
    }

    // Pour animation state
    let pourFrame = 0;
    const TOTAL_POUR_FRAMES = 320;

    const loop = () => {
      time++;
      const w = canvas.width;
      const h = canvas.height;

      let scrollVal = journey.smoothProgress.get();
      if (typeof scrollVal !== 'number' || isNaN(scrollVal)) scrollVal = 0;
      let scrollVel = journey.velocity.get();
      if (typeof scrollVel !== 'number' || isNaN(scrollVel)) scrollVel = 0;

      // Mouse easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // Determine current act
      const acts = JOURNEY_ACTS;
      let warmth = 0;

      // Warmth increases in roasting room
      if (scrollVal >= acts[3].start && scrollVal <= acts[3].end) {
        warmth = subProgress(scrollVal, acts[3].start, acts[3].end) * 0.8;
      } else if (scrollVal >= acts[4].start && scrollVal <= acts[4].end) {
        warmth = 0.3;
      }

      // ── BACKGROUND (always drawn) ──
      drawBackground(ctx, w, h, colors, currentMouseX, currentMouseY, warmth);

      // ── ACT-SPECIFIC CANVAS SCENES ──

      // Act 1: Hero (0.00–0.12) — Pour animation
      if (scrollVal < acts[1].end) {
        const heroAlpha = scrollVal < acts[0].end
          ? 1
          : Math.max(0, 1 - subProgress(scrollVal, acts[0].end, acts[1].end));

        if (heroAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = heroAlpha;

          // Advance pour
          if (pourFrame < TOTAL_POUR_FRAMES) pourFrame++;
          const pourProgress = pourFrame / TOTAL_POUR_FRAMES;

          drawHeroCup(
            ctx, w, h,
            currentMouseX, currentMouseY,
            pourProgress, time, scrollVel,
            steamParticles, splashParticles,
          );
          ctx.restore();
        }
      }

      // Act 2: Enter Shop (0.12–0.25) — Frame sequence scrub
      if (scrollVal >= acts[1].start && scrollVal <= acts[1].end + 0.05) {
        const enterProgress = subProgress(scrollVal, acts[1].start, acts[1].end);
        const enterAlpha = enterProgress < 0.15
          ? enterProgress / 0.15
          : (enterProgress > 0.85 ? (1 - enterProgress) / 0.15 : 1);

        if (enterAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, enterAlpha);
          drawFrameSequence(ctx, w, h, framesRef.current, enterProgress);
          ctx.restore();
        }
      }

      // Act 4: Roasting Room (0.38–0.52)
      if (scrollVal >= acts[3].start - 0.02 && scrollVal <= acts[3].end + 0.02) {
        const roastProgress = subProgress(scrollVal, acts[3].start, acts[3].end);
        const roastAlpha = roastProgress < 0.1
          ? roastProgress / 0.1
          : (roastProgress > 0.9 ? (1 - roastProgress) / 0.1 : 1);

        if (roastAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = roastAlpha;
          drawRoastingScene(ctx, w, h, roastProgress, time, beanParticles);
          ctx.restore();
        }
      }

      // Act 5: Machine (0.52–0.68)
      if (scrollVal >= acts[4].start - 0.02 && scrollVal <= acts[4].end + 0.02) {
        const machineProgress = subProgress(scrollVal, acts[4].start, acts[4].end);
        const machineAlpha = machineProgress < 0.1
          ? machineProgress / 0.1
          : (machineProgress > 0.9 ? (1 - machineProgress) / 0.1 : 1);

        if (machineAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = machineAlpha;
          drawMachineScene(ctx, w, h, machineProgress, time, steamParticles, scrollVel);
          ctx.restore();
        }
      }

      // Act 6: Table (0.68–0.82)
      if (scrollVal >= acts[5].start - 0.02 && scrollVal <= acts[5].end + 0.02) {
        const tableProgress = subProgress(scrollVal, acts[5].start, acts[5].end);
        const tableAlpha = tableProgress < 0.1
          ? tableProgress / 0.1
          : (tableProgress > 0.9 ? (1 - tableProgress) / 0.1 : 1);

        if (tableAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = tableAlpha;
          drawTableScene(ctx, w, h, tableProgress, time, bokehParticles);
          ctx.restore();
        }
      }

      // Act 7: Checkout (0.82–1.0) — Bokeh gathering
      if (scrollVal >= acts[6].start - 0.02) {
        const checkoutProgress = subProgress(scrollVal, acts[6].start, acts[6].end);
        const checkoutAlpha = checkoutProgress < 0.15
          ? checkoutProgress / 0.15
          : 1;

        if (checkoutAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = checkoutAlpha * 0.7;
          for (const b of bokehParticles) {
            b.update(time);
            b.draw(ctx);
          }
          // Central warm glow
          const glowR = Math.min(w, h) * (0.2 + checkoutProgress * 0.3);
          const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, glowR);
          glow.addColorStop(0, `rgba(79, 156, 143, ${0.15 * checkoutProgress})`);
          glow.addColorStop(0.5, `rgba(212, 165, 116, ${0.1 * checkoutProgress})`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
        }
      }

      // Global ambient steam (subtle, always present after hero)
      if (scrollVal > 0.1) {
        for (let i = steamParticles.length - 1; i >= 0; i--) {
          steamParticles[i].update(scrollVel);
          if (steamParticles[i].life >= 1) steamParticles.splice(i, 1);
          else steamParticles[i].draw(ctx);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [journey.smoothProgress, journey.velocity, colors]);

  return (
    <div
      id="scroll-journey-container"
      ref={containerRef}
      className="relative"
      style={{ height: `${JOURNEY_HEIGHT_VH}vh` }}
    >
      {/* Sticky Canvas Layer */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-10">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* ── ACT OVERLAYS (HTML content) ── */}

        {/* Act 1: Hero */}
        <ScrollScene
          startProgress={JOURNEY_ACTS[0].start}
          endProgress={JOURNEY_ACTS[0].end}
          smoothProgress={journey.smoothProgress}
          fadeIn={0.1}
          fadeOut={0.3}
        >
          <div className="text-center px-4 pt-16 sm:pt-20 md:pt-24 max-w-3xl mx-auto flex flex-col items-center">
            <span className="text-[var(--coffee-accent)] font-extrabold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs md:text-sm block mb-3 sm:mb-4 font-inter">
              BREWHAUS · EST. 2014
            </span>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-playfair font-normal text-[#F5E6D3] tracking-tight leading-none flex flex-col items-center mb-4 sm:mb-6 drop-shadow-md">
              <span>Experience</span>
              <span className="italic font-playfair font-normal text-[var(--coffee-accent)] mt-0.5 sm:mt-1">Coffee</span>
            </h1>
            <p className="text-xs sm:text-base md:text-lg text-[#C9B8A0] font-inter max-w-xl mx-auto font-light leading-relaxed mb-6 sm:mb-8 px-2">
              Where each bean tells a story and every sip is a quiet ritual.<br className="hidden sm:inline" />
              {' '}Discover blends crafted by master baristas.
            </p>
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <span className="inline-block px-6 py-3 sm:px-8 sm:py-3.5 bg-[var(--coffee-accent)] text-[#1A0F0A] rounded-full text-xs md:text-sm font-bold font-inter tracking-widest uppercase cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-[rgba(79,156,143,0.25)]">
                Begin the Journey ↓
              </span>
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--coffee-accent)] animate-bounce mt-2" />
            </div>
          </div>
        </ScrollScene>

        {/* Act 2: Enter Shop */}
        <ScrollScene
          startProgress={JOURNEY_ACTS[1].start}
          endProgress={JOURNEY_ACTS[1].end}
          smoothProgress={journey.smoothProgress}
          fadeIn={0.2}
          fadeOut={0.25}
        >
          <div className="text-center px-4 max-w-2xl mx-auto">
            <span className="text-[var(--coffee-accent)] font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs block mb-3 font-inter opacity-70">
              STEP INSIDE
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-bold text-[#F5E6D3] mb-4 drop-shadow-lg">
              Welcome to <span className="italic font-normal text-[var(--coffee-accent)]">Brewhaus</span>
            </h2>
            <p className="text-sm sm:text-base text-[#C9B8A0] font-inter max-w-md mx-auto leading-relaxed">
              Push through the door and let the aroma guide you.
              The warmth of freshly roasted beans fills the air.
            </p>
          </div>
        </ScrollScene>

        {/* Act 3: Counter — Product Showcase */}
        <ScrollScene
          startProgress={JOURNEY_ACTS[2].start}
          endProgress={JOURNEY_ACTS[2].end}
          smoothProgress={journey.smoothProgress}
          fadeIn={0.15}
          fadeOut={0.2}
        >
          <div className="w-full max-h-[90vh] overflow-y-auto no-scrollbar px-2 sm:px-4">
            <ProductShowcase onAddToCart={onAddToCart} />
          </div>
        </ScrollScene>

        {/* Act 4: Roasting Room — Feature Section */}
        <ScrollScene
          startProgress={JOURNEY_ACTS[3].start}
          endProgress={JOURNEY_ACTS[3].end}
          smoothProgress={journey.smoothProgress}
          fadeIn={0.15}
          fadeOut={0.2}
        >
          <div className="w-full max-h-[90vh] overflow-y-auto no-scrollbar px-2 sm:px-4">
            <FeatureSection />
          </div>
        </ScrollScene>

        {/* Act 5: Coffee Machine — Brewing Guide */}
        <ScrollScene
          startProgress={JOURNEY_ACTS[4].start}
          endProgress={JOURNEY_ACTS[4].end}
          smoothProgress={journey.smoothProgress}
          fadeIn={0.12}
          fadeOut={0.18}
        >
          <div className="w-full max-h-[90vh] overflow-y-auto no-scrollbar px-2 sm:px-4">
            <BrewingGuide />
          </div>
        </ScrollScene>

        {/* Act 6: Table */}
        <ScrollScene
          startProgress={JOURNEY_ACTS[5].start}
          endProgress={JOURNEY_ACTS[5].end}
          smoothProgress={journey.smoothProgress}
          fadeIn={0.15}
          fadeOut={0.2}
        >
          <div className="text-center px-4 max-w-2xl mx-auto">
            <span className="text-[#D4A574] font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs block mb-3 font-inter opacity-70">
              YOUR TABLE AWAITS
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-bold text-[#F5E6D3] mb-4">
              Sit Back & <span className="italic font-normal text-[var(--coffee-accent)]">Savor</span>
            </h2>
            <p className="text-sm sm:text-base text-[#C9B8A0] font-inter max-w-md mx-auto leading-relaxed mb-8">
              Every cup is a small ceremony. Take a moment to breathe in the rich
              aroma and appreciate the artistry in your latte.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="bg-[#1A0F0A]/60 border border-[var(--coffee-border)]/30 p-3 rounded-xl text-center">
                <div className="text-2xl mb-1">🌡️</div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4A574] font-inter">93°C</span>
                <p className="text-[10px] text-[#C9B8A0] font-inter mt-0.5">Perfect Temp</p>
              </div>
              <div className="bg-[#1A0F0A]/60 border border-[var(--coffee-border)]/30 p-3 rounded-xl text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--coffee-accent)] font-inter">28s</span>
                <p className="text-[10px] text-[#C9B8A0] font-inter mt-0.5">Extraction</p>
              </div>
              <div className="bg-[#1A0F0A]/60 border border-[var(--coffee-border)]/30 p-3 rounded-xl text-center">
                <div className="text-2xl mb-1">☕</div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4A574] font-inter">1:2</span>
                <p className="text-[10px] text-[#C9B8A0] font-inter mt-0.5">Ratio</p>
              </div>
            </div>
          </div>
        </ScrollScene>

        {/* Act 7: Checkout — Final CTA */}
        <ScrollScene
          startProgress={JOURNEY_ACTS[6].start}
          endProgress={JOURNEY_ACTS[6].end}
          smoothProgress={journey.smoothProgress}
          fadeIn={0.18}
          fadeOut={0.05}
        >
          <div className="w-full">
            <FinalCTA />
          </div>
        </ScrollScene>
      </div>

      {/* Progress Indicator (fixed, not inside sticky) */}
      <ScrollProgressIndicator smoothProgress={journey.smoothProgress} />
    </div>
  );
}
