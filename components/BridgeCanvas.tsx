"use client";
import { useRef, useEffect } from "react";

export default function BridgeCanvas() {
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
    // Use window state to toggle mobile layout safely
    const isMobile = window.innerWidth < 768;

    const lTowerX = isMobile ? 0.45 : 0.58;
    const rTowerX = isMobile ? 0.95 : 0.84;
    const bridgeStartX = isMobile ? -0.10 : 0.38;
    const bridgeEndX = isMobile ? 1.10 : 1.02;
    const anchorEndX = isMobile ? 1.10 : 1.04;

    const accentColors = [
      palette.energy, palette.copper, palette.gold, palette.teal,
      palette.tealLt, palette.goldLt, palette.white,
    ];

    // ---- Deck (horizontal road surface) ----
    dotLine(bridgeStartX, 0.72, bridgeEndX, 0.72, isMobile ? 250 : 160, palette.dimLt, 1.6);
    dotLine(bridgeStartX, 0.735, bridgeEndX, 0.735, isMobile ? 250 : 160, palette.dim, 1.2);

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
    catenaryCable(bridgeStartX, 0.60, lTowerX, 0.105, 0.04, isMobile ? 80 : 55, palette.tealLt, 2.2);
    // Main span left tower → right tower
    catenaryCable(lTowerX, 0.105, rTowerX, 0.175, 0.09, 130, palette.teal, 2.4);
    // Right tower → right anchor
    catenaryCable(rTowerX, 0.175, anchorEndX, 0.66, 0.04, isMobile ? 80 : 50, palette.tealLt, 2.0);

    // Secondary cable (offset below primary)
    catenaryCable(bridgeStartX, 0.625, lTowerX, 0.125, 0.045, isMobile ? 60 : 45, palette.teal, 1.6);
    catenaryCable(lTowerX, 0.125, rTowerX, 0.195, 0.095, 110, palette.tealLt, 1.8);
    catenaryCable(rTowerX, 0.195, anchorEndX, 0.68, 0.04, isMobile ? 60 : 42, palette.teal, 1.5);

    // Tertiary dim cable
    catenaryCable(bridgeStartX, 0.64, lTowerX, 0.145, 0.04, isMobile ? 50 : 35, palette.dimLt, 1.2);
    catenaryCable(lTowerX, 0.145, rTowerX, 0.215, 0.10, 85, palette.dimLt, 1.4);
    catenaryCable(rTowerX, 0.215, anchorEndX, 0.70, 0.04, isMobile ? 50 : 32, palette.dimLt, 1.1);

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
    for (let i = 0; i < (isMobile ? 90 : 60); i++) {
      const t = Math.random();
      const ix = bridgeStartX + (lTowerX - bridgeStartX) * t;
      const cableY = 0.60 + (0.105 - 0.60) * t + 4 * 0.04 * t * (1 - t);
      const col = accentColors[Math.floor(Math.random() * accentColors.length)];
      addDot(ix, cableY, col, 1.5 + Math.random() * 1.5, 1, Math.random() * 0.6);
    }

    // ---- Vertical hangers (suspender cables) ----
    const hangerStep = isMobile ? 0.015 : 0.018;
    for (let ix = bridgeStartX; ix < bridgeEndX; ix += hangerStep) {
      let cableY: number;
      let col: string;
      let sz = 1.1;

      if (ix < lTowerX) {
        const t = (ix - bridgeStartX) / (lTowerX - bridgeStartX);
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
        const t = (ix - rTowerX) / (anchorEndX - rTowerX);
        cableY = 0.175 + (0.66 - 0.175) * t + 4 * 0.04 * t * (1 - t);
        col = palette.dimLt; sz = 1.0;
      }
      dotCol(ix, cableY, 0.72, 0.016, col, sz);
    }

    // ---- Bridge piers / ground ----
    dotLine(bridgeStartX, 0.745, bridgeEndX, 0.745, isMobile ? 200 : 100, palette.dim, 1.3);
    // Left pier
    dotCol(lTowerX - 0.008, 0.73, 0.85, 0.013, palette.dimLt, 2.0);
    dotCol(lTowerX, 0.73, 0.85, 0.013, palette.gold, 2.4);
    dotCol(lTowerX + 0.008, 0.73, 0.85, 0.013, palette.dimLt, 2.0);
    // Right pier
    dotCol(rTowerX - 0.008, 0.73, 0.80, 0.013, palette.dimLt, 2.0);
    dotCol(rTowerX, 0.73, 0.80, 0.013, palette.gold, 2.4);
    dotCol(rTowerX + 0.008, 0.73, 0.80, 0.013, palette.dimLt, 2.0);

    // ---- Ambient sparkle field ----
    for (let i = 0; i < (isMobile ? 150 : 90); i++) {
      const x = isMobile ? Math.random() : (0.42 + Math.random() * 0.55);
      const y = 0.04 + Math.random() * 0.90;
      const col = accentColors[Math.floor(Math.random() * accentColors.length)];
      addDot(x, y, col, 0.7 + Math.random() * 1.0, 1, Math.random() * 1.0);
    }

    // -----------------------------------------------------------------------
    // Render loop
    // -----------------------------------------------------------------------
    // -----------------------------------------------------------------------
    // Pre-render Glows (drastically speeds up draw loop)
    // -----------------------------------------------------------------------
    const preRenderGlow = (baseColor: string) => {
      const oc = document.createElement("canvas");
      oc.width = 64; oc.height = 64;
      const octx = oc.getContext("2d");
      if (!octx) return oc;
      const grad = octx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, `${baseColor}3C`);
      grad.addColorStop(1, "transparent");
      octx.fillStyle = grad;
      octx.fillRect(0, 0, 64, 64);
      return oc;
    };
    const glowCache: Record<string, HTMLCanvasElement> = {};
    const getGlow = (col: string) => {
      if (!glowCache[col]) glowCache[col] = preRenderGlow(col);
      return glowCache[col];
    };

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

        // Occasional random blink
        if ((dot.phase * 10) % 1.5 < 0.2) { // 10-15% of dots that blink
          const blink = Math.pow(Math.abs(Math.sin(time * (1.0 + (dot.phase % 1)) + dot.phase * 20)), 128);
          if (blink > 0.05) {
            alpha += blink * 2.5;
            size += blink * 1.5;
          }
        }

        let extraAlpha = 0;
        if (dist < haloR) {
          const inf = 1 - dist / haloR;
          size += inf * 2.5;
          extraAlpha = inf * 0.6;
          alpha = Math.min(1, alpha + extraAlpha);
        }

        // Draw glow for bright dots
        if (alpha > 0.25 && size > 1.2) {
          const r = size * 3;
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.drawImage(getGlow(dot.color), px - r, py - r, r * 2, r * 2);
          ctx.globalAlpha = 1.0;
        }

        // Core dot
        ctx.beginPath();
        const coreAlphaHex = Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, "0");
        ctx.arc(px, py, size * (0.85 + 0.15 * Math.sin(time * 1.2 + dot.phase)), 0, Math.PI * 2);
        ctx.fillStyle = `${dot.color}${coreAlphaHex}`;
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
    
    // Defer the heavy calculation so the rest of the page can paint
    const timeoutId = setTimeout(() => {
      draw();
    }, 800);

    return () => {
      clearTimeout(timeoutId);
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
