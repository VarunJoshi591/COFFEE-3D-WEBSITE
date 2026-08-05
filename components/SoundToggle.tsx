'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from './CoffeeSoundEngine';

interface SliderProps {
  label: string;
  emoji: string;
  value: number;
  onChange: (val: number) => void;
}

function VolumeSlider({ label, emoji, value, onChange }: SliderProps) {
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-base w-6 text-center shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-[var(--coffee-text-secondary)] tracking-wider uppercase font-inter">
            {label}
          </span>
          <span className="text-[10px] text-[var(--coffee-text-secondary)] font-inter tabular-nums">
            {Math.round(value * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(value * 100)}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--coffee-accent)] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-[var(--coffee-accent)]/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--coffee-bg-primary)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--coffee-accent)] [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--coffee-bg-primary)]"
          style={{
            background: `linear-gradient(to right, var(--coffee-accent) 0%, var(--coffee-accent) ${value * 100}%, var(--coffee-border) ${value * 100}%, var(--coffee-border) 100%)`,
          }}
        />
      </div>
    </div>
  );
}

// Animated equalizer bars for the playing state
function EqualizerBars() {
  return (
    <div className="flex items-end gap-[2px] h-3.5">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-[2.5px] rounded-full bg-[var(--coffee-accent)]"
          animate={{
            height: ['40%', '100%', '55%', '85%', '40%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8 + i * 0.15,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

export default function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [masterVol, setMasterVol] = useState(0.2);
  const [cafeVol, setCafeVol] = useState(0.6);
  const [rainVol, setRainVol] = useState(0.4);
  const [brewVol, setBrewVol] = useState(0.5);
  const [spoonVol, setSpoonVol] = useState(0.3);

  // Sync state from engine on mount
  useEffect(() => {
    const s = soundEngine.getState();
    setMasterVol(s.masterVolume);
    setCafeVol(s.cafeVolume);
    setRainVol(s.rainVolume);
    setBrewVol(s.brewVolume);
    setSpoonVol(s.spoonVolume);
  }, []);

  const handleToggle = useCallback(() => {
    const playing = soundEngine.toggle();
    setIsPlaying(playing);
  }, []);

  const handleMasterVol = useCallback((v: number) => {
    setMasterVol(v);
    soundEngine.setMasterVolume(v);
  }, []);

  const handleCafeVol = useCallback((v: number) => {
    setCafeVol(v);
    soundEngine.setCafeVolume(v);
  }, []);

  const handleRainVol = useCallback((v: number) => {
    setRainVol(v);
    soundEngine.setRainVolume(v);
  }, []);

  const handleBrewVol = useCallback((v: number) => {
    setBrewVol(v);
    soundEngine.setBrewVolume(v);
  }, []);

  const handleSpoonVol = useCallback((v: number) => {
    setSpoonVol(v);
    soundEngine.setSpoonVolume(v);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[100]">
      {/* Expandable Mixer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-14 sm:bottom-16 left-0 w-[calc(100vw-2rem)] max-w-[280px] sm:w-72 rounded-2xl border shadow-2xl backdrop-blur-2xl p-4 sm:p-5 space-y-3 sm:space-y-4"
            style={{
              backgroundColor: 'var(--coffee-bg-primary)',
              borderColor: 'var(--coffee-border)',
            }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase font-inter" style={{ color: 'var(--coffee-accent)' }}>
                Café Soundscape
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--coffee-text-secondary)] hover:text-[var(--coffee-text-primary)] transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Master Volume */}
            <div className="pb-3 border-b" style={{ borderColor: 'var(--coffee-border)' }}>
              <VolumeSlider label="Master Volume" emoji="🔊" value={masterVol} onChange={handleMasterVol} />
            </div>

            {/* Individual Layers */}
            <VolumeSlider label="Café Ambience" emoji="☕" value={cafeVol} onChange={handleCafeVol} />
            <VolumeSlider label="Gentle Rain" emoji="🌧️" value={rainVol} onChange={handleRainVol} />
            <VolumeSlider label="Coffee Brewing" emoji="🫖" value={brewVol} onChange={handleBrewVol} />
            <VolumeSlider label="Spoon Clink" emoji="🥄" value={spoonVol} onChange={handleSpoonVol} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleToggle}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl border backdrop-blur-xl transition-all duration-300"
          style={{
            backgroundColor: isPlaying ? 'var(--coffee-accent)' : 'var(--coffee-bg-secondary)',
            borderColor: isPlaying ? 'var(--coffee-accent)' : 'var(--coffee-border)',
          }}
          aria-label={isPlaying ? 'Mute ambient sounds' : 'Play ambient sounds'}
        >
          {isPlaying ? (
            <EqualizerBars />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coffee-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </motion.button>

        {/* Settings Gear */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border backdrop-blur-xl transition-all duration-300"
          style={{
            backgroundColor: isOpen ? 'var(--coffee-accent)' : 'var(--coffee-bg-secondary)',
            borderColor: isOpen ? 'var(--coffee-accent)' : 'var(--coffee-border)',
          }}
          aria-label="Open sound mixer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen ? 'var(--coffee-bg-primary)' : 'var(--coffee-text-secondary)'} strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
