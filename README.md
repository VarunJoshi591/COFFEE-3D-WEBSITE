# ☕ L'AROMA — 3D Scroll-Driven Coffee Experience

An immersive, premium 3D web experience built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**, powered by a high-performance **HTML5 Canvas** particle engine. 

The website delivers a sensory digital journey through interactive scroll-triggered animations, fluid-dynamic steam simulations, kinetic coffee bean physics, and a luxurious, fully responsive layout.

---

## ✨ Features & Interactive Elements

*   **🎬 Interactive 3D Canvas Scroll System**
    *   **Smooth Scene Cross-Fade**: Fades between a clean product studio scene and a cozy, warm café atmosphere dynamically as the user scrolls.
    *   **Parallax Zoom & Shift**: The canvas responds dynamically to scroll coordinates with custom easing.
    *   **3D Mouse-Parallax**: Subtly shifts perspective based on real-time mouse coordinate tracking, offering a sense of spatial depth.
*   **💨 Procedural Particle Simulation**
    *   **Kinetic Steam Emitters**: Dual emitters simulate organic rising steam using customizable velocity, life span, and size growth factor.
    *   **Scroll-Driven Wind/Velocity**: High-speed scrolling increases the upward kinetic force, causing the steam and aroma bokeh sparks to rise faster.
    *   **Floating Coffee Beans & Bokeh Sparks**: Custom rendering curves draw floating 3D-esque beans and glowing orange/turquoise aroma particles that respond to scrolls.
*   **🛒 Artisanal Product Showcase**
    *   **The Reserve Line**: Beautiful grid layout featuring premium single-origin coffees (e.g., *Ethiopian Yirgacheffe*, *Sumatra Mandheling*) with custom card entrance animations.
    *   **Interactive Cart**: Responsive state updates with micro-animations when adding products to the selection count.
*   **🎨 Premium Coffee Aesthetic**
    *   Deep espresso gradients (`#1A0F0A` to `#0A0503`), luxury gold accents, glassmorphic navigations, and typography (Playfair Display & Inter).

---

## 🛠️ Tech Stack & Libraries

*   **Core**: [Next.js 14 (App Router)](https://nextjs.org/) & [React](https://react.dev/) (TypeScript)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/) (utilizing `useScroll`, `useSpring`, `useVelocity`, and `useTransform` for smooth rendering)
*   **Canvas Rendering**: Pure HTML5 2D Context Canvas API for lightweight, performant rendering of hundreds of physics-based particles
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with customized aesthetic color themes
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** (v18 or higher) and **npm** installed.

### Installation

1. Clone this repository to your local system:
   ```bash
   git clone https://github.com/VarunJoshi591/COFFEE-3D-WEBSITE.git
   cd COFFEE-3D-WEBSITE
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

### Building for Production

To create a optimized production build of the website:
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
COFFEE-3D-WEBSITE/
├── app/
│   ├── globals.css      # Core styles & Tailwind directives
│   ├── layout.tsx       # Next.js Root Layout with custom typography
│   └── page.tsx         # Main entry point importing layout sections
├── components/
│   ├── HeroCanvasAnimation.tsx # HTML5 Canvas particle & scroll controller
│   ├── ProductShowcase.tsx    # Header navbar & coffee product catalog
│   ├── FeatureSection.tsx     # SCA ratings & Direct trade highlights
│   └── FinalCTA.tsx           # Luxury Newsletter / Reservation footer
├── data/
│   └── products.ts      # Structured list of coffee details & features
├── public/
│   ├── cup_studio.png   # Studio mockup scene image
│   └── cup_cafe.jpg     # Café atmosphere scene image
└── package.json         # Scripts and dependencies
```

---

## 🔧 How to Customize

### Adding/Modifying Blends
You can update the coffee selections, origins, prices, and roast notes in [products.ts](file:///d:/My%20Projects/COFFEE-3D-WEBSITE/data/products.ts).

### Tweaking Particle Physics
In [HeroCanvasAnimation.tsx](file:///d:/My%20Projects/COFFEE-3D-WEBSITE/components/HeroCanvasAnimation.tsx):
*   Change particle limits by adjusting `maxParticles` and `maxSteamParticles`.
*   Adjust scroll damping and spring stiffness by tweaking the config inside `useSpring(scrollYProgress, { stiffness, damping })`.
*   Modify steam drift speeds by updating the `vy` velocity calculations in `createSteamParticle`.
