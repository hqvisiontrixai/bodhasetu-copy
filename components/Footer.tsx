"use client";

import { useEffect, useRef } from "react";

export default function SegmintFooter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SQUARE_COLOR = "#0a0a0a";
    const SZ = 10;
    const GAP = 0;
    const STEP = SZ + GAP;

    let cols: number;
    let rows: number;
    let grid: boolean[][] = [];

    function seededRand(seed: number) {
      let s = seed;
      return function () {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    }

    function build() {
      const parent = canvas?.parentElement;
      if (!parent || !canvas || !ctx) return;

      const W = parent.offsetWidth;
      // Reduced height to keep the transition tight to the text
      const H = 240; 

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(W / STEP) + 1;
      rows = Math.ceil(H / STEP) + 1;

      const rand = seededRand(42);
      grid = [];

      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        const t = r / (rows - 1);
        
        let density;
        if (t < 0.1) {
          density = 1; 
        } else {
          // Sharp power (3.5) makes the pixels disappear faster vertically
          density = Math.pow(Math.max(0, 1 - (t - 0.1) / 0.9), 3.5);
        }

        for (let c = 0; c < cols; c++) {
          grid[r][c] = rand() < density;
        }
      }
      draw();
    }

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = SQUARE_COLOR;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r] && grid[r][c]) {
            const x = c * STEP;
            const y = r * STEP;
            ctx.fillRect(x, y, SZ + 0.6, SZ + 0.6);
          }
        }
      }
    }

    build();
    window.addEventListener("resize", build);
    return () => window.removeEventListener("resize", build);
  }, []);

  return (
    <footer className="w-full flex flex-col overflow-hidden bg-[#B76A32]">
      {/* Container for the pixel transition */}
      <div className="w-full relative">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Removed the space band: 
         1. Removed the h-12 lead-in div
         2. Used a slight negative margin to tuck the text directly 
            under the fading pixel edge.
      */}
      <div className="px-10 pb-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-10">
          <div>
            <span className="block text-[clamp(40px,8vw,80px)] font-bold text-[#FAF8F6] tracking-tighter uppercase leading-[0.75]">
  <span className="block">VisiontriX</span>
  <span className="block mt-2">AI</span>
</span>
          </div>

          <div className="hidden md:flex gap-4 max-w-[400px] mb-2 font-mono">
            <span className="text-[20px] text-[#B76A32] font-bold">—</span>
            <p className="text-[11px] uppercase tracking-[0.15em] leading-relaxed text-[#FAF8F6] font-semibold">
              MARKETING APPROACH IN <br /> 
              WEBSITE DEVELOPMENT <br /> 
              WITH OUTSTANDING DESIGN
            </p>
          </div>

          <nav className="flex flex-col items-end gap-2 mb-2 font-mono text-[#FAF8F6]">
            <a href="#" className="text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity">
              Interested to start a project with us?
            </a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:text-[#B76A32] transition-colors">
              Let's talk →
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}