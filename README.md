<div align="center">

# ☕ BREWHAUS — 3D Luxury Coffee Experience

**An immersive, sensory, and scroll-driven digital coffee journey built with Next.js 14, Framer Motion, HTML5 Canvas, and procedural Web Audio.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Procedural-D4A574?style=for-the-badge&logo=soundcharts&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

<br />

[✨ Explore Features](#-features--interactive-elements) • [🔄 Recent Updates](#-recent-updates--changelog) • [🛠️ Tech Stack](#-tech-stack--architecture) • [🚀 Getting Started](#-getting-started) • [📂 Project Structure](#-project-structure) • [🔧 Customization](#-customization-guide)

</div>

---

## 📖 Overview

**BREWHAUS** is a state-of-the-art interactive web application designed to bring the warmth, ritual, and artistry of specialty coffee into a high-performance 3D web experience.

Rather than relying on heavy 3D asset bundles, **BREWHAUS** combines lightweight **HTML5 2D Context Canvas physics**, **Framer Motion spring interpolation**, **circadian time-of-day theming**, and a **100% procedural Web Audio synthesizer** to create an ultra-fast, sensory-rich digital flagship for coffee connoisseurs.

---

## ✨ Features & Interactive Elements

### 1. 🎬 High-Performance 3D Scroll Canvas & Dual-Scene Engine
* **Dynamic Scene Blending**: Seamlessly transitions between a clean, studio-lit hero showcase and a warm, ambient café interior based on scroll depth.
* **Scroll-Velocity Responsive Physics**: Scrolling faster increases wind forces and upward kinetic energy on particles.
* **Interactive 3D Mouse & Touch Parallax**: Subtly tilts and translates perspective in response to mouse coordinates or smartphone gyro/touch movements.
* **High-DPI / Retina Optimization**: Automatically scales canvas pixel ratios (`Math.min(devicePixelRatio, 2)`) for crystal-clear visuals with zero frame drops.

### 2. 💨 Organic Particle Simulation & Steam Dynamics
* **Dual Kinetic Steam Emitters**: Simulates buoyant, rising coffee steam using sine-wave wobble equations, thermal decay, and progressive dissipation.
* **Physics-Driven Coffee Beans**: Floating roasted coffee beans with tumbling 3D rotation, gravity acceleration, and fluid drag.
* **Seamless Hero Transition**: 0px gap rendering smoothly flows from the canvas animation into the product menu.

### 3. ⏳ 4-Stage Interactive Coffee Preparation Preloader
* **Phase 1: Roasted Beans Fall**: Physics-simulated whole coffee beans cascade and bounce into the grinder hopper.
* **Phase 2: Burr Grinding**: Animated micro-particles simulate precision coffee grinding.
* **Phase 3: Espresso Extraction & Cup Fill**: Fresh espresso fills the ceramic cup accompanied by rising aromatic steam.
* **Phase 4: Fluid Reveal**: Seamlessly dissolves into the live storefront with an optional instant "Skip" trigger.

### 4. 🎧 Multi-Track Web Audio Synthesizer (Zero Downloads)
* **100% Procedural Web Audio**: Generates realistic café soundscapes on the fly using synthetic white/pink noise buffers, biquad resonant filters, and gain oscillators without loading external audio MP3 files.
* **4 Independent Ambient Channels**:
  * ☕ **Café Ambience**: Warm room tone and subtle chatter murmurs.
  * 🌧 **Rain on Window**: Low-pass filtered rhythmic rain drops.
  * 🫧 **Brewing & Steam Hiss**: Percolating bubbles and espresso steam release.
  * 🥄 **Spoon Clink**: High-frequency metallic resonance against ceramic.
* **Interactive Equalizer & Controls**: Animated soundwave equalizer bars, individual layer volume sliders, and master volume control.

### 5. 🌅 Dynamic Time-of-Day Adaptive Theme Engine
* Automatically detects user local time and adapts the site's atmosphere, color palette, and canvas lighting:
  * ☀️ **Morning Roast** *(06:00 – 11:59)*: Energizing sunrise amber, golden honey, and warm cream tones.
  * 🌤 **Golden Afternoon** *(12:00 – 17:59)*: Bright café lighting with emerald and mint teal accents.
  * 🌙 **Midnight Espresso** *(18:00 – 05:59)*: Deep obsidian, dark roast bronze, and gold luxury accents.
* **Interactive Floating Toast**: Animated badge displaying current theme with automatic hourly updates and manual dismiss.

### 6. 📖 Interactive Barista Brewing Guide
* **Method Switcher**: Explore step-by-step extraction rituals for **V60 Pour Over**, **French Press**, and **Espresso**.
* **Barista Ratio & Metric Cards**: Real-time display of coffee-to-water ratios, grind micron sizes, water temperatures, and extraction target times.
* **Framer Motion Layout Animations**: Smooth tab sliding indicators and staggered step-by-step directions.

### 7. ☕ Curated 9-Item Artisanal Coffee Menu
* **Category Filtering Tabs**: Instantly switch between `All`, `Hot`, `Cold`, and `Specialty` creations.
* **Crafted Blends**:
  * *Cappuccino*, *Velvet Latte*, *Artisan Mocha*, *Espresso Supreme*, *Flat White*, *Caramel Macchiato*, *Cold Brew Reserve (18-Hr Steep)*, *Affogato Al Caffè*, and *Ceremonial Matcha Latte*.
* **Interactive Cart Experience**: Add to cart triggers spring-scaled micro-animations and live badge counters.

### 8. 📱 Complete Mobile & Tablet Optimization
* Touch-gesture navigation with smooth backdrop-blurred mobile drawer.
* Dynamic viewport unit adaptation (`dvh`) and body scroll locking during animations.
* Responsive typography combining **Playfair Display** (luxury editorial serif) and **Inter** (clean sans-serif).

---

## 🔄 Recent Updates & Changelog

| Category | Changes & Enhancements |
| :--- | :--- |
| **🎨 Theming System** | Implemented `ThemeProvider.tsx` with automated circadian time-of-day detection (Morning, Afternoon, Night), dynamic CSS variables token system, and floating theme indicator badge. |
| **🎵 Audio Engine** | Built pure Web Audio API procedural sound engine (`CoffeeSoundEngine.ts`) with 4 distinct ambient sound layers (Café, Rain, Brewing, Spoon Clink), volume sliders, and animated equalizer UI (`SoundToggle.tsx`). |
| **⏳ Preloader** | Engineered 4-phase interactive canvas loader (`CoffeeLoader.tsx`) simulating bean drop, burr grinding, cup filling, and smooth reveal with touch-scroll lock and skip button. |
| **📖 Brewing Guide** | Added `BrewingGuide.tsx` featuring precision barista metrics (Ratios, Grind Sizes, Extraction Timers, Brew Temperatures) with interactive step-by-step guides. |
| **🍽 Coffee Menu Expansion** | Expanded product catalog in `data/products.ts` to 9 artisanal coffees with category filtering tabs (`Hot`, `Cold`, `Specialty`), high-res imagery, and animated cart micro-interactions. |
| **📱 Mobile & UI Polish** | Optimized canvas scaling for high-DPI Retina screens, added glassmorphic mobile navigation drawer, and eliminated scroll gaps between canvas hero and content sections. |
| **⚡ Performance & Build** | Configured Next.js 14 App Router, dynamic imports, lightweight canvas particle physics, and optimized production build configurations. |

---

## 🛠️ Tech Stack & Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       BREWHAUS FRONTEND                      │
├───────────────────────────────┬──────────────────────────────┤
│ Core Framework                │ Next.js 14 (App Router)      │
│ Language                      │ TypeScript 5.0               │
│ UI Library                    │ React 18                     │
│ Animation & Motion Engine     │ Framer Motion 12             │
│ Particle & Visual Simulation  │ HTML5 2D Canvas API          │
│ Sound Engine                  │ Web Audio API (Synthesizer)  │
│ Styling & Tokens              │ Tailwind CSS 3.4 + CSS Vars  │
│ Typography                    │ Playfair Display & Inter     │
│ Iconography                   │ Lucide React                 │
└───────────────────────────────┴──────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: version `18.17.0` or higher
* **npm** / **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VarunJoshi591/COFFEE-3D-WEBSITE.git
   cd COFFEE-3D-WEBSITE
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Launch the app**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

To build and run the optimized production bundle:

```bash
# Build the application
npm run build

# Start production server
npm run start
```

To run linting:
```bash
npm run lint
```

---

## 📂 Project Structure

```text
COFFEE-3D-WEBSITE/
├── app/
│   ├── globals.css               # Global CSS, Tailwind directives & CSS variables
│   ├── layout.tsx                # Root layout, Google Fonts & viewport metadata
│   └── page.tsx                  # Home page assembling all sections & providers
├── components/
│   ├── BrewingGuide.tsx          # Interactive barista brewing methods & parameters
│   ├── CoffeeLoader.tsx          # 4-stage physics-based coffee preparation preloader
│   ├── CoffeeSoundEngine.ts      # Procedural Web Audio synthesizer (4 ambient tracks)
│   ├── FeatureSection.tsx        # Brand values, bean sourcing & barista highlights
│   ├── FinalCTA.tsx              # Luxury newsletter CTA & VIP club section
│   ├── HeroCanvasAnimation.tsx   # 3D dual-scene canvas particle & scroll controller
│   ├── Navbar.tsx                # Glassmorphic header with cart counter & mobile drawer
│   ├── ProductCard.tsx           # Individual artisanal coffee card with animations
│   ├── ProductShowcase.tsx       # 9-item catalog with category filtering tabs
│   ├── SoundToggle.tsx           # Floating ambient sound controller & channel mixer
│   └── ThemeProvider.tsx         # Time-of-day circadian theme provider & context
├── data/
│   └── products.ts               # Structured database of coffee products & features
├── public/
│   ├── coffee/                   # High-res photography of signature blends
│   ├── cup_cafe.jpg              # Ambient café background scene image
│   ├── cup_studio.png            # Studio lighting product scene image
│   └── favicon.ico               # Brand icon
├── tailwind.config.ts            # Custom design tokens, keyframe animations & colors
├── tsconfig.json                 # TypeScript compiler configuration
└── package.json                  # Dependencies & npm scripts
```

---

## 🔧 Customization Guide

### 1. Adding or Modifying Coffee Blends
Edit [data/products.ts](data/products.ts) to add or adjust items, pricing, tasting notes, and categories:
```typescript
{
  id: 'custom-blend',
  name: 'Reserve Geisha',
  description: 'Delicate floral jasmine notes with bergamot and honey finish.',
  price: '$5.50',
  rating: 5.0,
  image: '/coffee/your_image.jpg',
  features: ['Panama Geisha', 'Washed Process', 'Floral & Silky'],
  category: 'specialty', // 'hot' | 'cold' | 'specialty'
}
```

### 2. Adjusting Ambient Sound Synthesizer
Modify procedural sound parameters in [components/CoffeeSoundEngine.ts](components/CoffeeSoundEngine.ts):
* Adjust noise buffer filter frequencies for rain and steam.
* Alter spoon ping resonance frequencies (`1800Hz - 3200Hz`) and exponential decay times.
* Change default channel volumes in `SoundEngineState`.

### 3. Tuning Particle Physics & Steam Dynamics
In [components/HeroCanvasAnimation.tsx](components/HeroCanvasAnimation.tsx):
* **Particle Count**: Adjust `maxParticles` and `maxSteamParticles`.
* **Buoyancy & Speed**: Modify `vy` calculations in `SteamParticle` class.
* **Scroll Inertia**: Tune spring physics via `useSpring(scrollYProgress, { stiffness: 100, damping: 30 })`.

### 4. Customizing Time-of-Day Theme Palettes
Update colors and transitions in [components/ThemeProvider.tsx](components/ThemeProvider.tsx) to customize the color harmony for Morning, Afternoon, or Night modes.

---

## 📱 Performance & Browser Compatibility

* **Modern Browsers**: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge.
* **Responsive Layouts**: Fully responsive across Mobile (`320px+`), Tablets (`768px+`), Laptops (`1024px+`), and Ultra-wide screens (`1440px+`).
* **Optimized Rendering**: Zero external audio downloads, hardware-accelerated 2D canvas transforms, and conditional animation rendering.

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and adapt it for personal or commercial projects.

---

<div align="center">
  <sub>Crafted with ☕ and passion by <a href="https://github.com/VarunJoshi591">Varun Joshi</a></sub>
</div>
