# ☕ BREWHAUS — COFFEE-3D-WEBSITE

> **Complete Project Architecture & Technical Documentation**

---

## 📋 Project Overview

**BREWHAUS** is a premium, single-page artisan coffee website built around a fully procedural **real-time 2D Canvas animation engine** that simulates a cinematic espresso-to-latte-art pour sequence. The site is designed to feel like an immersive, interactive experience rather than a static webpage — combining scroll-driven parallax, time-of-day adaptive theming, procedural ambient sound synthesis, and rich micro-animations.

### ✨ Key Highlights

| Feature | Description |
|---|---|
| **Canvas Pour Simulation** | Real-time espresso & milk pour with latte art bloom, drawn entirely via Canvas 2D API |
| **Procedural Sound Engine** | Web Audio API synthesizer generating café ambience, rain, brew drips & ceramic clinks |
| **Time-Based Theming** | Auto-detects Morning / Afternoon / Night and adapts entire color palette + canvas |
| **4-Phase Loading Screen** | Cinematic coffee-preparation loader (beans → grinding → cup fills → reveal) |
| **Scroll-Driven Parallax** | Framer Motion scroll hooks drive mouse-reactive 3D-like depth in the hero |
| **Responsive Design** | Mobile-first layout with dynamic canvas scaling and touch-friendly interactions |

---

## 🏗️ Project Architecture

```
COFFEE-3D-WEBSITE/
├── app/                          # Next.js App Router (Pages & Layouts)
│   ├── layout.tsx                # Root HTML layout, Google Fonts, metadata & viewport
│   ├── page.tsx                  # Main single-page application entry point
│   └── globals.css               # CSS variables, Tailwind directives, scrollbar styling
│
├── components/                   # All React UI Components
│   ├── HeroCanvasAnimation.tsx   # ★ Core Canvas 2D animation engine (776 lines)
│   ├── CoffeeLoader.tsx          # 4-phase loading screen with canvas animation
│   ├── CoffeeSoundEngine.ts      # Procedural Web Audio API sound synthesizer
│   ├── ThemeProvider.tsx          # Time-of-day context provider & CSS variable injector
│   ├── Navbar.tsx                # Fixed navigation header with mobile drawer
│   ├── ProductShowcase.tsx       # Filterable product grid with category tabs
│   ├── ProductCard.tsx           # Individual product card with hover effects
│   ├── FeatureSection.tsx        # "Why Brewhaus" feature highlights section
│   ├── BrewingGuide.tsx          # Interactive tabbed brewing method guide
│   ├── SoundToggle.tsx           # Ambient sound mixer panel with per-layer sliders
│   └── FinalCTA.tsx              # Bottom call-to-action section
│
├── data/                         # Static Data Layer
│   └── products.ts               # Product catalog, feature highlights & TypeScript interfaces
│
├── public/                       # Static Assets
│   ├── coffee/                   # Product images (JPG) + processed PNG assets
│   │   ├── cappuccino.jpg        # Product card images
│   │   ├── latte.jpg
│   │   ├── mocha.jpg
│   │   ├── espresso.jpg
│   │   ├── flat_white.jpg
│   │   ├── caramel_macchiato.jpg
│   │   ├── cold_brew.jpg
│   │   ├── affogato.jpg
│   │   ├── matcha_latte.jpg
│   │   ├── cup-centered.png      # Feature section center coffee cup
│   │   ├── bean.png              # Processed coffee bean asset
│   │   └── splash-banner.jpg     # Banner splash image
│   └── frames/                   # 120 WebP frames (frame_0.webp → frame_119.webp)
│
├── scripts/                      # Python image processing & asset pipeline scripts
│   ├── generate_frames.py        # Main frame generation pipeline
│   ├── remove_background.py      # Background removal utility
│   ├── process_bean.py           # Coffee bean asset processor
│   ├── process_bean_perfect.py   # Enhanced bean processor
│   ├── crop_assets.py            # Asset cropping utility
│   ├── clean_brown_cup.py        # Cup image cleaner
│   ├── clean_splash.py           # Splash effect cleaner
│   ├── refine_cream_cup.py       # Cream cup refinement
│   ├── check_alpha.py            # Alpha channel validator
│   ├── check_images.py           # Image integrity checker
│   └── test_*.py                 # Various rendering & masking test scripts
│
├── next.config.mjs               # Next.js configuration (unoptimized images)
├── tailwind.config.ts            # Tailwind CSS theme extensions & custom animations
├── tsconfig.json                 # TypeScript strict mode configuration
├── postcss.config.mjs            # PostCSS with Tailwind plugin
├── package.json                  # Dependencies & scripts
├── .env / .env.example           # Environment variables (NEXT_PUBLIC_APP_URL)
└── .vercel/                      # Vercel deployment configuration
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | `14.2.3` | React framework with App Router, SSR, file-based routing |
| **React** | `^18` | UI component library |
| **TypeScript** | `^5` | Type-safe development with strict mode |
| **Tailwind CSS** | `^3.4.1` | Utility-first CSS framework with custom theme tokens |
| **Framer Motion** | `^12.40.0` | Declarative animations, scroll hooks, layout transitions |
| **Lucide React** | `^1.17.0` | Icon library (Coffee, ShoppingBag, Menu, Chevron, etc.) |
| **PostCSS** | `^8` | CSS processing pipeline for Tailwind |

### Backend

> **This project has no traditional backend or server-side API.**

The application is a **fully static, client-side rendered (CSR) single-page application** exported via Next.js. There is no database, no server API endpoints, and no backend language. All logic runs in the browser.

| Aspect | Implementation |
|---|---|
| **Rendering** | Client-side (`'use client'` directive on all components) |
| **Data** | Static TypeScript files (`data/products.ts`) — no API calls |
| **Deployment** | Static export (`next build` → `out/` directory), hosted on **Vercel** |
| **Environment** | Single env var: `NEXT_PUBLIC_APP_URL` (base URL only) |

### Languages Used

| Language | Where Used | Purpose |
|---|---|---|
| **TypeScript / TSX** | `app/`, `components/`, `data/` | All frontend code, components, logic |
| **CSS** | `globals.css`, `tailwind.config.ts` | Styling, CSS custom properties, theme tokens |
| **Python** | `scripts/` | Offline asset processing & frame generation pipeline |

---

## 🎨 Animation System — Deep Dive

The project features **three distinct animation systems** working in concert:

### 1. Canvas 2D Pour Simulation Engine — [`HeroCanvasAnimation.tsx`](components/HeroCanvasAnimation.tsx)

This is the crown jewel — a **776-line real-time Canvas 2D rendering engine** that draws the entire hero section procedurally at 60fps via `requestAnimationFrame`.

#### Pour Timeline (320 frames ≈ 5.3 seconds)

```
Phase 1  ██████████░░░░░░░░░░  (0% → 48%)   Espresso Pour
Phase 2  ░░░░░░░░██████████░░  (48% → 90%)   Milk Pour + Latte Art Bloom
Phase 3  ░░░░░░░░░░░░░░░░░░██  (90% → 100%)  Finish & Steam
```

#### What Gets Drawn Each Frame

| Layer | Technique |
|---|---|
| **Atmospheric Background** | Radial gradient following mouse position (parallax depth) |
| **Vignette Overlay** | Radial gradient from center to edges for cinematic focus |
| **Saucer + Shadow** | Ellipse geometry with blur filter shadow |
| **Cup Handle** | Arc stroke with linear gradient |
| **Ceramic Cup Body** | Bézier curve silhouette with multi-stop ceramic gradient |
| **Inner Cup Cavity** | Clipping mask for liquid containment |
| **Rising Liquid** | Fill level animation from bottom to top with espresso gradient |
| **Crema Surface** | Radial gradient on top liquid ellipse |
| **Latte Art Rosetta** | 6-layer Bézier petal pattern + heart crown, scaled by progress |
| **Espresso Stream** | Quadratic curve with flow gradient (Phase 1) |
| **Milk Stream** | Quadratic curve with white/cream gradient (Phase 2) |
| **Splash Particles** | `SplashParticle` class — physics-driven droplets at pour impact |
| **Steam Particles** | `SteamParticle` class — thermal buoyancy, wobble sine, fade/grow |
| **Concentric Ripples** | Expanding ellipse stroke on liquid surface during pour |

#### Particle Physics Classes

```typescript
class SteamParticle {
  // Thermal buoyancy (vy: upward), sine-wave wobble
  // Radial gradient rendering for soft cloud appearance
  // Fade-in → fade-out lifecycle with size expansion
  // Scroll-velocity reactive (faster scroll = faster steam)
}

class SplashParticle {
  // Gravity-affected projectile motion (vy += gravity)
  // Random arc ejection angles at pour hit point
  // Color differentiation: espresso (#D4A574, #3A1F13) vs milk (#FFFDF9)
  // Linear alpha decay over life
}
```

#### Interactivity

| Input | Effect |
|---|---|
| **Mouse Position** | Eased parallax offset on cup, background, and vignette |
| **Scroll Progress** | `useScroll` + `useSpring` drives vertical offset & text opacity |
| **Scroll Velocity** | `useVelocity` intensifies steam emission rate and drift speed |
| **Re-pour Button** | Resets `pourFrameRef` to 0, replays entire pour simulation |

---

### 2. Framer Motion Declarative Animations

Used across all non-canvas UI components for entrance, interaction, and layout transitions.

| Animation Type | Where Used | Technique |
|---|---|---|
| **Scroll-triggered entrance** | Section headings, cards, features | `whileInView` with `initial` opacity/y |
| **Hover & tap scaling** | Buttons, product cards, toggles | `whileHover`, `whileTap` |
| **Layout animations** | Product grid filtering | `layout` prop + `AnimatePresence mode="popLayout"` |
| **Tab slider** | Brewing guide tabs | `layoutId="activeTabBg"` with spring physics |
| **Bounce loops** | Scroll indicator, CTA sparkle | `animate` with `repeat: Infinity` |
| **Exit animations** | Loader, mobile menu, theme badge | `AnimatePresence` + `exit` variants |
| **Cart bounce** | Navbar cart icon | Keyframe scale sequence on `key` change |

---

### 3. CSS / Tailwind Keyframe Animations

Defined in [`tailwind.config.ts`](tailwind.config.ts):

| Animation | Keyframes | Duration | Usage |
|---|---|---|---|
| `float` | `translateY(0) → -15px → 0` | 6s infinite | Feature section coffee cup image |
| `glow` | Opacity pulse + drop-shadow intensity | 2s infinite | Accent glow effects |
| `slideUp` | `translateY(30px) + opacity 0 → 0 + 1` | 0.8s forwards | Section content entrance |
| `ping` | CSS `animate-ping` | Built-in | Navbar logo hover ring |
| `pulse` | CSS `animate-pulse` | Built-in | Status indicator dot, loader icon |

---

### 4. Coffee Preparation Loading Screen — [`CoffeeLoader.tsx`](components/CoffeeLoader.tsx)

A secondary Canvas 2D animation that plays as a loading intro (5.2 seconds):

| Phase | Duration | Visual |
|---|---|---|
| **1. Beans Falling** | 0% → 32% | Tumbling coffee beans with rotation fall into grinder hopper |
| **2. Grinding** | 32% → 65% | Vibrating grinder body showers ground coffee particles |
| **3. Cup Fills** | 65% → 92% | Espresso stream fills ceramic cup, crema forms, steam rises |
| **4. Website Reveal** | 92% → 100% | Transition to main content with fade + scale exit |

The loader includes a **Skip Intro** button, a glowing gradient progress bar, and dynamic phase text.

---

## 🔊 Procedural Sound Engine — [`CoffeeSoundEngine.ts`](components/CoffeeSoundEngine.ts)

A singleton class that uses the **Web Audio API** to procedurally synthesize café ambience with **zero audio files**.

### Audio Architecture

```
                    ┌─────────────┐
                    │ AudioContext │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Master Gain │ ← Master Volume (default: 0.2)
                    └──────┬──────┘
              ┌────────────┼────────────┐────────────┐
              │            │            │            │
        ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐ ┌───▼────┐
        │ Café Gain  │ │ Rain  │ │ Brew Gain │ │ Spoon  │
        │  (0.6)     │ │ (0.4) │ │   (0.5)   │ │ (0.3)  │
        └─────┬──────┘ └───┬───┘ └─────┬─────┘ └───┬────┘
              │            │            │            │
        ┌─────▼──────┐ ┌──▼────┐ ┌─────▼─────┐ ┌───▼─────┐
        │ Brown Noise │ │ Pink  │ │ Oscillator│ │ Dual    │
        │ Buffer     │ │ Noise │ │ Drip      │ │ Osc     │
        │ + LowPass  │ │ Buffer│ │ Bursts    │ │ Clink   │
        │  (350 Hz)  │ │+ LP   │ │ (random)  │ │ Bursts  │
        └────────────┘ │(750Hz)│ └───────────┘ └─────────┘
                       └───────┘
```

### Sound Layers

| Layer | Synthesis Method | Character |
|---|---|---|
| **Café Ambience** | Looped brown noise buffer (5s) → 350 Hz lowpass filter | Warm, low-frequency murmur |
| **Gentle Rain** | Looped pink noise buffer (5s) → 750 Hz lowpass filter | Soft, steady patter |
| **Coffee Brewing** | Random sine oscillator bursts (400–1000 Hz) with bandpass, triggered every 120–370ms | Percolating drip trickle |
| **Spoon Clink** | Dual sine oscillators (2100 Hz + 3400 Hz) with fast decay, triggered every 6–15 seconds | Ceramic tap accent |

### Mixer UI — [`SoundToggle.tsx`](components/SoundToggle.tsx)

- Fixed bottom-left toggle button with animated equalizer bars
- Expandable panel with **5 independent volume sliders** (Master + 4 layers)
- Each slider drives `GainNode.setValueAtTime()` in real-time
- Custom styled range inputs with accent-colored fill tracks

---

## 🌗 Time-Based Theming System — [`ThemeProvider.tsx`](components/ThemeProvider.tsx)

A React Context provider that detects the user's local time and applies one of three theme palettes.

### Theme Schedule

| Time Window | Theme | Emoji | Greeting | Accent Color |
|---|---|---|---|---|
| 06:00 – 11:59 | `morning` | ☀️ | Good Morning | `#E8944C` (warm orange) |
| 12:00 – 17:59 | `afternoon` | 🌤 | Good Afternoon | `#4F9C8F` (teal) |
| 18:00 – 05:59 | `night` | 🌙 | Good Evening | `#4F9C8F` (teal) |

### How It Works

1. On mount, `getThemeForHour(new Date().getHours())` detects the current time slot
2. `applyTheme()` injects **8 CSS custom properties** onto `document.documentElement`:
   - `--coffee-bg-primary`, `--coffee-bg-secondary`, `--coffee-border`
   - `--coffee-text-primary`, `--coffee-text-secondary`
   - `--coffee-accent`, `--coffee-gold`, `--coffee-espresso`
3. The canvas engine reads theme-specific `canvasBg1/2/3` and `ambientGlow` colors from context
4. Re-checks every **60 seconds** via `setInterval` for natural transitions
5. A `ThemeBadge` toast appears for 5 seconds showing the detected theme

### Theme Color Propagation

```
ThemeProvider (Context)
  ├── CSS Variables → Tailwind classes (text-coffee-accent, bg-coffee-primary, etc.)
  ├── colors object → Canvas 2D gradients (HeroCanvasAnimation reads canvasBg1/2/3)
  └── theme name → page.tsx dynamically sets body background class
```

---

## 📦 Data Layer — [`data/products.ts`](data/products.ts)

All product and feature data is defined as **static TypeScript arrays** with full type safety.

### `CoffeeProduct` Interface

```typescript
interface CoffeeProduct {
  id: string;           // URL-safe slug
  name: string;         // Display name
  description: string;  // Card description text
  price: string;        // Formatted price (e.g. "$4.50")
  rating: number;       // Star rating (0-5)
  image: string;        // Path to product image in /public/coffee/
  features: string[];   // 3 feature tag pills
  category: 'hot' | 'cold' | 'specialty';  // Filter category
}
```

### Product Catalog (9 items)

| Product | Category | Price | Rating |
|---|---|---|---|
| Cappuccino | Hot | $3.50 | 4.9 |
| Velvet Latte | Hot | $4.00 | 5.0 |
| Artisan Mocha | Hot | $4.50 | 4.7 |
| Espresso Supreme | Hot | $3.00 | 4.9 |
| Flat White | Hot | $4.20 | 4.8 |
| Caramel Macchiato | Hot | $4.75 | 4.9 |
| Cold Brew Reserve | Cold | $4.50 | 5.0 |
| Affogato Al Caffè | Specialty | $5.20 | 4.9 |
| Ceremonial Matcha Latte | Specialty | $4.80 | 4.8 |

### `FeatureHighlight` Interface

```typescript
interface FeatureHighlight {
  title: string;
  description: string;
  position: 'left' | 'right';  // Layout position in feature grid
}
```

### Brewing Methods (3 items — defined in `BrewingGuide.tsx`)

| Method | Ratio | Grind | Time | Temperature |
|---|---|---|---|---|
| V60 Pour Over | 1:15 | Medium-Fine | 3:00 min | 93°C / 200°F |
| French Press | 1:16 | Coarse | 4:00 min | 95°C / 203°F |
| Espresso | 1:2 | Fine (Powder) | 28-32 sec | 92°C / 198°F |

---

## 🔌 API System

### External APIs

> **None.** This project makes **zero external API calls**. There are no REST endpoints, GraphQL queries, or third-party service integrations.

### Internal Data Flow

All data flows are **in-memory, client-side**:

```
Static TS Data (products.ts)
    │
    ▼
React Components (via import)
    │
    ├── ProductShowcase → filters by category state → renders ProductCards
    ├── FeatureSection → maps feature highlights into grid layout
    └── BrewingGuide → switches between brew methods via tab state
```

### State Management

| State | Scope | Mechanism |
|---|---|---|
| Cart count | `HomeContent` → `Navbar`, `ProductShowcase` | `useState` + prop drilling |
| Active product category | `ProductShowcase` | Local `useState` |
| Active brew method | `BrewingGuide` | Local `useState` |
| Pour animation progress | `HeroCanvasAnimation` | `useRef` (frame counter) + `useState` (UI sync) |
| Sound playback state | `SoundToggle` ↔ `CoffeeSoundEngine` | Singleton class + `useState` mirror |
| Theme (time-of-day) | `ThemeProvider` → all children | React Context (`createContext`) |
| Loading state | `HomeContent` | `useState` (controls CoffeeLoader visibility) |
| Mobile menu open | `Navbar` | Local `useState` |

### Browser APIs Used

| API | Component | Purpose |
|---|---|---|
| **Canvas 2D** | `HeroCanvasAnimation`, `CoffeeLoader` | Real-time procedural rendering |
| **Web Audio API** | `CoffeeSoundEngine` | Procedural sound synthesis (no audio files) |
| **requestAnimationFrame** | Canvas components | 60fps render loops |
| **ResizeObserver / resize event** | Canvas components | Dynamic canvas scaling |
| **MouseEvent** | `HeroCanvasAnimation` | Parallax mouse tracking |
| **CSS Custom Properties** | `ThemeProvider` | Dynamic theme injection |
| **Intersection Observer** | Framer Motion `whileInView` | Scroll-triggered animations |

---

## 🧰 Asset Pipeline (`scripts/`)

The `scripts/` directory contains **18 Python scripts** for offline image processing:

| Script | Purpose |
|---|---|
| `generate_frames.py` | Main frame generation pipeline (120 WebP frames → `public/frames/`) |
| `remove_background.py` | Alpha-channel background removal for product photos |
| `process_bean.py` / `process_bean_perfect.py` | Coffee bean asset extraction and refinement |
| `crop_assets.py` | Automated cropping of cup, lid, splash sub-assets |
| `clean_brown_cup.py` / `clean_splash.py` | Cleanup scripts for specific asset artifacts |
| `refine_cream_cup.py` | Cream cup color correction |
| `check_alpha.py` / `check_images.py` | Validation scripts for alpha channels and image integrity |
| `test_*.py` (8 scripts) | Test rendering, masking, color keying, splash isolation |

> **Note:** The frame assets in `public/frames/` (120 WebP files) are pre-generated outputs from this pipeline. They are **not used by the current Canvas animation** (which is fully procedural) but are available as a fallback or for alternative rendering approaches.

---

## 📱 Responsive Design Strategy

| Breakpoint | Approach |
|---|---|
| **Mobile (< 640px)** | Vertical stacking, smaller typography, touch-friendly tap targets (44px min), hamburger menu |
| **Tablet (640–1024px)** | 2-column product grid, expanded navigation |
| **Desktop (1024px+)** | 3-column product grid, full horizontal navigation, larger canvas geometry |

Canvas scaling is **dynamic** — cup radius, position, and font sizes are calculated as proportions of `canvas.width` and `canvas.height`, ensuring the animation looks correct at any viewport size.

---

## 🚀 Build & Deployment

```bash
# Development
npm run dev          # Starts Next.js dev server at localhost:3000

# Production Build
npm run build        # Generates optimized static build in .next/

# Production Start
npm run start        # Serves the production build

# Linting
npm run lint         # Runs ESLint with Next.js config
```

**Deployment Target:** Vercel (configured via `.vercel/` directory)

**Image Optimization:** Disabled (`images.unoptimized: true` in `next.config.mjs`) since most visual content is rendered procedurally on canvas rather than served as optimized images.

---

## 📐 Design System

### Typography

| Font | Family | Weight | Usage |
|---|---|---|---|
| **Playfair Display** | Serif | 400, 600, 700 | Headings, brand text, display type |
| **Inter** | Sans-serif | 400, 500, 600 | Body text, labels, buttons, UI elements |

Both loaded via `next/font/google` for optimal performance with CSS variable binding.

### Color Palette (Night Theme — Default)

| Token | Value | Usage |
|---|---|---|
| `--coffee-espresso` | `#1A0F0A` | Deepest background, navbar |
| `--coffee-bg-primary` | `#2D1810` | Primary section backgrounds |
| `--coffee-bg-secondary` | `#3D2820` | Card backgrounds, elevated surfaces |
| `--coffee-border` | `#5A4034` | Borders, separators |
| `--coffee-text-primary` | `#F5E6D3` | Main body text (cream/latte) |
| `--coffee-text-secondary` | `#C9B8A0` | Muted captions, labels |
| `--coffee-accent` | `#4F9C8F` | CTAs, active states, teal accent |
| `--coffee-gold` | `#FFD700` | Star ratings, premium accents |

---

*Last Updated: August 2026*
