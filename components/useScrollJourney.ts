'use client';

import { useMemo } from 'react';
import { MotionValue, useTransform, useVelocity, useSpring } from 'framer-motion';

export interface JourneyAct {
  id: string;
  label: string;
  emoji: string;
  start: number; // 0–1 global scroll range
  end: number;
}

export const JOURNEY_ACTS: JourneyAct[] = [
  { id: 'hero',       label: 'Welcome',       emoji: '☕', start: 0.00, end: 0.12 },
  { id: 'enter',      label: 'Enter Shop',    emoji: '🚪', start: 0.12, end: 0.25 },
  { id: 'counter',    label: 'The Counter',   emoji: '🧑‍🍳', start: 0.25, end: 0.38 },
  { id: 'roasting',   label: 'Roasting Room', emoji: '🔥', start: 0.38, end: 0.52 },
  { id: 'machine',    label: 'The Machine',   emoji: '⚙️', start: 0.52, end: 0.68 },
  { id: 'table',      label: 'Your Table',    emoji: '🪑', start: 0.68, end: 0.82 },
  { id: 'checkout',   label: 'Checkout',      emoji: '✨', start: 0.82, end: 1.00 },
];

/** Total scroll height multiplier (in viewport heights). */
export const JOURNEY_HEIGHT_VH = 800;

export interface ScrollJourneyState {
  /** 0–1 global scroll progress */
  progress: MotionValue<number>;
  /** Smoothed global progress */
  smoothProgress: MotionValue<number>;
  /** Scroll velocity (for reactive effects) */
  velocity: MotionValue<number>;
  /** All acts definition */
  acts: JourneyAct[];
}

/**
 * Returns scroll-journey derived motion values.
 * Wraps raw framer-motion scroll values into act-aware utilities.
 */
export function useScrollJourney(
  scrollYProgress: MotionValue<number>,
): ScrollJourneyState {
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.0005,
  });

  const rawVelocity = useVelocity(scrollYProgress);
  const velocity = useSpring(rawVelocity, {
    stiffness: 100,
    damping: 30,
  });

  return useMemo(() => ({
    progress: scrollYProgress,
    smoothProgress,
    velocity,
    acts: JOURNEY_ACTS,
  }), [scrollYProgress, smoothProgress, velocity]);
}

/**
 * Utility: remap a global progress value into a 0–1 sub-range.
 * e.g. subProgress(0.3, 0.25, 0.38) → ~0.38
 */
export function subProgress(global: number, start: number, end: number): number {
  if (end <= start) return 0;
  return Math.max(0, Math.min(1, (global - start) / (end - start)));
}

/**
 * Returns a MotionValue that maps global progress to a sub-range [0,1].
 */
export function useSubProgress(
  smoothProgress: MotionValue<number>,
  start: number,
  end: number,
): MotionValue<number> {
  return useTransform(smoothProgress, [start, end], [0, 1]);
}
