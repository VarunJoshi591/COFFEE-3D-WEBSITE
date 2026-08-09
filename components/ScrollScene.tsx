'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface ScrollSceneProps {
  /** When this scene becomes active (0–1 global progress) */
  startProgress: number;
  /** When this scene ends (0–1 global progress) */
  endProgress: number;
  /** The smoothed global scroll progress MotionValue */
  smoothProgress: MotionValue<number>;
  /** Content to display */
  children: React.ReactNode;
  /** Optional className for the overlay container */
  className?: string;
  /** Fade-in duration as fraction of scene length (0–0.5). Default 0.15 */
  fadeIn?: number;
  /** Fade-out duration as fraction of scene length (0–0.5). Default 0.15 */
  fadeOut?: number;
}

/**
 * ScrollScene wraps content that fades in/out based on scroll progress.
 * It's rendered as a positioned overlay on top of the canvas.
 */
export default function ScrollScene({
  startProgress,
  endProgress,
  smoothProgress,
  children,
  className = '',
  fadeIn = 0.15,
  fadeOut = 0.15,
}: ScrollSceneProps) {
  const sceneLen = endProgress - startProgress;
  const fadeInEnd = startProgress + sceneLen * fadeIn;
  const fadeOutStart = endProgress - sceneLen * fadeOut;

  // Opacity: 0 → 1 during fadeIn, 1 during body, 1 → 0 during fadeOut
  const opacity = useTransform(smoothProgress, (v) => {
    if (v < startProgress || v > endProgress) return 0;
    if (v < fadeInEnd) {
      return (v - startProgress) / (fadeInEnd - startProgress);
    }
    if (v > fadeOutStart) {
      return 1 - (v - fadeOutStart) / (endProgress - fadeOutStart);
    }
    return 1;
  });

  // Subtle Y translation for cinematic entrance
  const y = useTransform(smoothProgress, (v) => {
    if (v < startProgress) return 40;
    if (v < fadeInEnd) {
      const t = (v - startProgress) / (fadeInEnd - startProgress);
      return 40 * (1 - t);
    }
    if (v > fadeOutStart) {
      const t = (v - fadeOutStart) / (endProgress - fadeOutStart);
      return -30 * t;
    }
    return 0;
  });

  // Scale effect
  const scale = useTransform(smoothProgress, (v) => {
    if (v < startProgress) return 0.96;
    if (v < fadeInEnd) {
      const t = (v - startProgress) / (fadeInEnd - startProgress);
      return 0.96 + 0.04 * t;
    }
    if (v > fadeOutStart) {
      const t = (v - fadeOutStart) / (endProgress - fadeOutStart);
      return 1 - 0.03 * t;
    }
    return 1;
  });

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
    >
      <div className="pointer-events-auto w-full h-full flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}
