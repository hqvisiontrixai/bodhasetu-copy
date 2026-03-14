"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Bridge particle canvas
// ---------------------------------------------------------------------------
function BridgeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Map canvas to container
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // -----------------------------------------------------------------------
    // Build a bridge point cloud
    // -----------------------------------------------------------------------
    type Dot = {
      x: number;       // target x (0-1 normalised)
      y: number;       // target y (0-1 normalised)
      color: string;
      size: number;
      phase: number;   // animation phase offset
      born: number;    // spawn time
      twinkle: number;
    };

    const palette = {
      gold: "#A27B3D",
      goldLt: "#C9A96E",
      copper: "#B76A32",
      energy: "#C64320",
      teal: "#2D5351",
      tealLt: "#3D7270",
      dim: "#4a3b2a",
      dimLt: "#6b5842",
      white: "#FAF8F6",
    };

    const dots: Dot[] = [];

    const addDot = (nx: number, ny: number, col: string, sz = 1.8, twinkle = 0, bornDelay = -1) => {
      dots.push({
        x: nx, y: ny,
        color: col,
        size: sz,
        phase: Math.random() * Math.PI * 2,
        // negative = already born; positive = scheduled
        born: bornDelay >= 0 ? bornDelay : Math.random() * 1.2,
        twinkle,
      });
    };

    // ---- Helper to add a line of dots between two normalised points ----
    const dotLine = (
      x1: number, y1: number, x2: number, y2: number,
      count: number, col: string, sz?: number, twinkle = 0
    ) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        addDot(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, col, sz, twinkle);
      }
    };

    // ---- Helper for a vertical column ----
    const dotCol = (nx: number, yTop: number, yBot: number, step: number, col: string, sz?: number) => {
      let y = yTop;
      while (y <= yBot) { addDot(nx, y, col, sz); y += step; }
    };

    // ---- Helper for a catenary-style cable ----
    const catenaryCable = (
      x1: number, y1: number, x2: number, y2: number,
      sag: number, count: number, col: string, sz?: number
    ) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        const cx = x1 + (x2 - x1) * t;
        // Simple parabolic sag
        const cy = y1 + (y2 - y1) * t + 4 * sag * t * (1 - t);
        addDot(cx, cy, col, sz, 0.25, Math.random() * 0.5);
      }
    };

    // Bridge occupies the right portion of the screen (x: 0.38 → 1.05)
    // All x coordinates are in normalised 0–1 space of the FULL canvas width
    // so left tower at 0.58, right tower at 0.82 puts them in the right half
    const lTowerX = 0.58;
    const rTowerX = 0.84;

    const accentColors = [
      palette.energy, palette.copper, palette.gold, palette.teal,
      palette.tealLt, palette.goldLt, palette.white,
    ];

    // ---- Deck (horizontal road surface) ----
    dotLine(0.38, 0.72, 1.02, 0.72, 160, palette.dimLt, 1.6);
    dotLine(0.38, 0.735, 1.02, 0.735, 160, palette.dim, 1.2);

    // ---- Left tower ----
    dotCol(lTowerX, 0.13, 0.73, 0.010, palette.goldLt, 2.8);
    dotCol(lTowerX - 0.008, 0.13, 0.73, 0.011, palette.gold, 2.0);
    dotCol(lTowerX + 0.008, 0.13, 0.73, 0.011, palette.gold, 2.0);
    dotCol(lTowerX - 0.016, 0.22, 0.73, 0.013, palette.copper, 1.4);
    dotCol(lTowerX + 0.016, 0.22, 0.73, 0.013, palette.copper, 1.4);
    // cross-beams
    dotLine(lTowerX - 0.022, 0.34, lTowerX + 0.022, 0.34, 10, palette.copper, 2.0);
    dotLine(lTowerX - 0.022, 0.48, lTowerX + 0.022, 0.48, 10, palette.copper, 2.0);
    dotLine(lTowerX - 0.022, 0.62, lTowerX + 0.022, 0.62, 10, palette.copper, 2.0);
    // tower cap
    addDot(lTowerX, 0.105, palette.energy, 4.5, 1, 0);
    addDot(lTowerX - 0.006, 0.115, palette.goldLt, 3.0, 0.5, 0);
    addDot(lTowerX + 0.006, 0.115, palette.goldLt, 3.0, 0.5, 0);

    // ---- Right tower ----
    dotCol(rTowerX, 0.20, 0.73, 0.010, palette.goldLt, 2.8);
    dotCol(rTowerX - 0.008, 0.20, 0.73, 0.011, palette.gold, 2.0);
    dotCol(rTowerX + 0.008, 0.20, 0.73, 0.011, palette.gold, 2.0);
    dotCol(rTowerX - 0.016, 0.28, 0.73, 0.013, palette.copper, 1.4);
    dotCol(rTowerX + 0.016, 0.28, 0.73, 0.013, palette.copper, 1.4);
    // cross-beams
    dotLine(rTowerX - 0.022, 0.38, rTowerX + 0.022, 0.38, 10, palette.copper, 2.0);
    dotLine(rTowerX - 0.022, 0.52, rTowerX + 0.022, 0.52, 10, palette.copper, 2.0);
    dotLine(rTowerX - 0.022, 0.64, rTowerX + 0.022, 0.64, 10, palette.copper, 2.0);
    // tower cap
    addDot(rTowerX, 0.175, palette.energy, 4.5, 1, 0);
    addDot(rTowerX - 0.006, 0.185, palette.goldLt, 3.0, 0.5, 0);
    addDot(rTowerX + 0.006, 0.185, palette.goldLt, 3.0, 0.5, 0);

    // ---- Main catenary cables (very dense, bright) ----
    // Left anchor → left tower top
    catenaryCable(0.38, 0.60, lTowerX, 0.105, 0.04, 55, palette.tealLt, 2.2);
    // Main span left tower → right tower
    catenaryCable(lTowerX, 0.105, rTowerX, 0.175, 0.09, 130, palette.teal, 2.4);
    // Right tower → right anchor
    catenaryCable(rTowerX, 0.175, 1.04, 0.66, 0.04, 50, palette.tealLt, 2.0);

    // Secondary cable (offset below primary)
    catenaryCable(0.38, 0.625, lTowerX, 0.125, 0.045, 45, palette.teal, 1.6);
    catenaryCable(lTowerX, 0.125, rTowerX, 0.195, 0.095, 110, palette.tealLt, 1.8);
    catenaryCable(rTowerX, 0.195, 1.04, 0.68, 0.04, 42, palette.teal, 1.5);

    // Tertiary dim cable
    catenaryCable(0.38, 0.64, lTowerX, 0.145, 0.04, 35, palette.dimLt, 1.2);
    catenaryCable(lTowerX, 0.145, rTowerX, 0.215, 0.10, 85, palette.dimLt, 1.4);
    catenaryCable(rTowerX, 0.215, 1.04, 0.70, 0.04, 32, palette.dimLt, 1.1);

    // ---- Coloured accent sparkles on main span cable ----
    for (let i = 0; i < 200; i++) {
      const t = Math.random();
      const ix = lTowerX + (rTowerX - lTowerX) * t;
      const cableY = 0.105 + (0.175 - 0.105) * t + 4 * 0.09 * t * (1 - t);
      const col = accentColors[Math.floor(Math.random() * accentColors.length)];
      addDot(
        ix + (Math.random() - 0.5) * 0.006,
        cableY + (Math.random() - 0.5) * 0.01,
        col, 1.8 + Math.random() * 2.0, 1, Math.random() * 0.8
      );
    }
    // Accent sparkles on approach cables too
    for (let i = 0; i < 60; i++) {
      const t = Math.random();
      const ix = 0.38 + (lTowerX - 0.38) * t;
      const cableY = 0.60 + (0.105 - 0.60) * t + 4 * 0.04 * t * (1 - t);
      const col = accentColors[Math.floor(Math.random() * accentColors.length)];
      addDot(ix, cableY, col, 1.5 + Math.random() * 1.5, 1, Math.random() * 0.6);
    }

    // ---- Vertical hangers (suspender cables) ----
    for (let ix = 0.38; ix < 1.02; ix += 0.018) {
      let cableY: number;
      let col: string;
      let sz = 1.1;

      if (ix < lTowerX) {
        const t = (ix - 0.38) / (lTowerX - 0.38);
        cableY = 0.60 + (0.105 - 0.60) * t + 4 * 0.04 * t * (1 - t);
        col = palette.dimLt; sz = 1.0;
      } else if (ix <= rTowerX) {
        const t = (ix - lTowerX) / (rTowerX - lTowerX);
        cableY = 0.105 + (0.175 - 0.105) * t + 4 * 0.09 * t * (1 - t);
        if (t < 0.25) col = palette.copper;
        else if (t < 0.5) col = palette.teal;
        else if (t < 0.75) col = palette.gold;
        else col = palette.copper;
        sz = 1.3;
      } else {
        const t = (ix - rTowerX) / (1.04 - rTowerX);
        cableY = 0.175 + (0.66 - 0.175) * t + 4 * 0.04 * t * (1 - t);
        col = palette.dimLt; sz = 1.0;
      }
      dotCol(ix, cableY, 0.72, 0.016, col, sz);
    }

    // ---- Bridge piers / ground ----
    dotLine(0.38, 0.745, 1.02, 0.745, 100, palette.dim, 1.3);
    // Left pier
    dotCol(lTowerX - 0.008, 0.73, 0.85, 0.013, palette.dimLt, 2.0);
    dotCol(lTowerX, 0.73, 0.85, 0.013, palette.gold, 2.4);
    dotCol(lTowerX + 0.008, 0.73, 0.85, 0.013, palette.dimLt, 2.0);
    // Right pier
    dotCol(rTowerX - 0.008, 0.73, 0.80, 0.013, palette.dimLt, 2.0);
    dotCol(rTowerX, 0.73, 0.80, 0.013, palette.gold, 2.4);
    dotCol(rTowerX + 0.008, 0.73, 0.80, 0.013, palette.dimLt, 2.0);

    // ---- Ambient sparkle field (right half only) ----
    for (let i = 0; i < 90; i++) {
      const x = 0.42 + Math.random() * 0.55;
      const y = 0.04 + Math.random() * 0.90;
      const col = accentColors[Math.floor(Math.random() * accentColors.length)];
      addDot(x, y, col, 0.7 + Math.random() * 1.0, 1, Math.random() * 1.0);
    }

    // -----------------------------------------------------------------------
    // Render loop
    // -----------------------------------------------------------------------
    let mouse = { x: -999, y: -999 };

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      time += 0.012;

      dots.forEach((dot) => {
        if (time < dot.born) return;

        const px = dot.x * W;
        const py = dot.y * H;

        // Fade-in
        const age = Math.min(1, (time - dot.born) * 2.5);

        // Twinkle / pulse
        let alpha = age;
        if (dot.twinkle > 0) {
          alpha *= 0.5 + 0.5 * Math.sin(time * 2.5 + dot.phase) * dot.twinkle;
        }

        // Mouse halo
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const haloR = 80;
        let size = dot.size;
        let extraAlpha = 0;
        if (dist < haloR) {
          const inf = 1 - dist / haloR;
          size += inf * 2.5;
          extraAlpha = inf * 0.6;
          alpha = Math.min(1, alpha + extraAlpha);
        }

        // Draw glow for bright dots
        if (alpha > 0.25 && size > 1.2) {
          const grad = ctx.createRadialGradient(px, py, 0, px, py, size * 3);
          grad.addColorStop(0, `${dot.color}${Math.round(alpha * 60).toString(16).padStart(2, "0")}`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(px, py, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, size * (0.85 + 0.15 * Math.sin(time * 1.2 + dot.phase)), 0, Math.PI * 2);
        ctx.fillStyle = `${dot.color}${Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouse = { x: -999, y: -999 }; };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
export default function HeroSection() {
  const [inputValue, setInputValue] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);




  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT — Full-bleed Bridge canvas                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0 z-0">
        {/* Vignette to blend left text area */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, #0A0A0A 32%, #0A0A0Acc 50%, #0A0A0A66 62%, transparent 72%)",
          }}
        />
        {/* Top + bottom fade */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, #0A0A0A 0%, transparent 12%, transparent 80%, #0A0A0A 100%)",
          }}
        />
        <BridgeCanvas />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* LEFT — Content                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-8 md:px-16 pt-24 pb-16">
        <div className="max-w-xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold text-xs font-semibold text-[#C9A96E] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A27B3D] animate-pulse" />
              visiontriX AI · Early Access
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black leading-[0.92] tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem, 6vw, 4.8rem)" }}
          >
            <span className="text-cream">Bodha Setu</span>
            <span className="block text-gradient-gold mt-1"> </span>
            <span className="block text-cream/60 font-light text-[0.6em] mt-3 tracking-normal leading-snug">
              Insights. Redefined.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="text-[#AC9F91] text-base md:text-lg leading-relaxed mb-10 max-w-xl"
          >
            Real-time computer vision observes, interprets, and surfaces the insights hidden in plain sight.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.52 }}
            className="flex flex-wrap items-center gap-4 mb-14"
          >
            <Link
              href="/signup"
              id="hero-cta-button"
              className="relative group px-7 py-3.5 rounded-full font-semibold text-sm text-[#0A0A0A] overflow-hidden"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400 to-gray-200 cta-pulse" />
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Sign up for Early Access
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className="group-hover:translate-x-0.5 transition-transform">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </Link>


          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.68 }}
          >

          </motion.div>


        </div>
      </div>

    </section>
  );
}
