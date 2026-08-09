'use client';

import React, { useState, useEffect } from 'react';
import { motion, MotionValue, useTransform, useMotionValueEvent } from 'framer-motion';
import { JOURNEY_ACTS, JourneyAct } from './useScrollJourney';

interface ScrollProgressIndicatorProps {
  smoothProgress: MotionValue<number>;
}

export default function ScrollProgressIndicator({ smoothProgress }: ScrollProgressIndicatorProps) {
  const [activeActId, setActiveActId] = useState('hero');
  const [isHovered, setIsHovered] = useState(false);

  // Track active act based on scroll progress
  useMotionValueEvent(smoothProgress, 'change', (v) => {
    for (let i = JOURNEY_ACTS.length - 1; i >= 0; i--) {
      if (v >= JOURNEY_ACTS[i].start) {
        setActiveActId(JOURNEY_ACTS[i].id);
        break;
      }
    }
  });

  // Progress bar fill
  const progressHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  const scrollToAct = (act: JourneyAct) => {
    // The journey container is 800vh tall, so scroll to act.start * totalHeight
    const journeyEl = document.getElementById('scroll-journey-container');
    if (!journeyEl) return;
    const totalHeight = journeyEl.scrollHeight - window.innerHeight;
    const targetScroll = journeyEl.offsetTop + act.start * totalHeight;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  // Only show after user has scrolled a bit
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity: indicatorOpacity }}
      className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[80] flex flex-col items-center gap-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Track background */}
      <div className="relative w-1 sm:w-1.5 rounded-full overflow-hidden" style={{ height: '240px', backgroundColor: 'rgba(90, 64, 52, 0.3)' }}>
        {/* Fill progress */}
        <motion.div
          style={{ height: progressHeight }}
          className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-[var(--coffee-accent)] to-[#D4A574]"
        />
      </div>

      {/* Act dots positioned along the track */}
      <div className="absolute inset-0 flex flex-col justify-between items-center py-0" style={{ height: '240px' }}>
        {JOURNEY_ACTS.map((act) => {
          const isActive = act.id === activeActId;
          const dotPosition = act.start * 100;

          return (
            <button
              key={act.id}
              onClick={() => scrollToAct(act)}
              className="relative group flex items-center"
              style={{
                position: 'absolute',
                top: `${dotPosition}%`,
                transform: 'translateY(-50%)',
              }}
              title={act.label}
            >
              {/* Dot */}
              <motion.div
                animate={{
                  scale: isActive ? 1.4 : 1,
                  backgroundColor: isActive ? 'var(--coffee-accent)' : 'rgba(90, 64, 52, 0.6)',
                }}
                transition={{ duration: 0.3 }}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-[rgba(90,64,52,0.4)] shadow-sm cursor-pointer"
              />

              {/* Label (shows on hover) */}
              <motion.span
                initial={false}
                animate={{ opacity: isHovered || isActive ? 1 : 0, x: isHovered || isActive ? 0 : 8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-5 sm:right-6 whitespace-nowrap text-[10px] sm:text-xs font-semibold font-inter tracking-wide pointer-events-none"
                style={{
                  color: isActive ? 'var(--coffee-accent)' : 'var(--coffee-text-secondary)',
                }}
              >
                {act.emoji} {act.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
