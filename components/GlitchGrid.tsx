"use client";
import { useRef, useEffect } from "react";

const COLS = 16;
const ROWS = 8;

const PALETTE = [
  [162, 123, 61],   // gold
  [183, 106, 50],   // copper
  [45, 83, 81],     // teal
  [198, 67, 32],    // energy
  [152, 129, 93],   // neutral
  [80, 50, 20],     // dark brown
];

export default function GlitchGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999, down: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Block = {
      lit: number;
      colorIdx: number;
      targetLit: number;
      glitch: number;
    };

    const grid: Block[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        lit: 0,
        colorIdx: 0,
        targetLit: 0,
        glitch: 0,
      }))
    );

    // Signal propagations: { row, col, t, colorIdx, speed }
    const signals: { row: number; col: number; t: number; colorIdx: number; speed: number }[] = [];

    const triggerSignal = (row: number, col: number) => {
      signals.push({
        row,
        col,
        t: 0,
        colorIdx: Math.floor(Math.random() * PALETTE.length),
        speed: 0.5 + Math.random() * 0.5,
      });
    };

    const autoInterval = setInterval(() => {
      triggerSignal(
        Math.floor(Math.random() * ROWS),
        Math.floor(Math.random() * COLS)
      );
    }, 1500);

    let animId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      const cw = canvas.width / COLS;
      const ch = canvas.height / ROWS;
      const gap = 2;

      // Decay all blocks
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          grid[r][c].lit = Math.max(0, grid[r][c].lit - 0.025);
          grid[r][c].glitch = Math.max(0, grid[r][c].glitch - 0.05);
        }
      }

      // Update signals
      signals.forEach((sig, idx) => {
        sig.t += sig.speed;
        const radius = sig.t;

        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const dist = Math.sqrt((r - sig.row) ** 2 + (c - sig.col) ** 2);
            const waveDelta = Math.abs(dist - radius);
            if (waveDelta < 1.5) {
              const intensity = 1 - waveDelta / 1.5;
              const falloff = Math.max(0, 1 - sig.t / 10);
              const newLit = intensity * falloff;
              if (newLit > grid[r][c].lit) {
                grid[r][c].lit = newLit;
                grid[r][c].colorIdx = sig.colorIdx;
                if (Math.random() < 0.15) grid[r][c].glitch = 0.5;
              }
            }
          }
        }

        // Remove distant signals
        if (sig.t > Math.max(ROWS, COLS) * 1.5) signals.splice(idx, 1);
      });

      // Mouse influence
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const mouseCol = mx / cw;
      const mouseRow = my / ch;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const dist = Math.sqrt((r - mouseRow + 0.5) ** 2 + (c - mouseCol + 0.5) ** 2);
          if (dist < 2.5) {
            const inf = (1 - dist / 2.5) * 0.7;
            if (inf > grid[r][c].lit) {
              grid[r][c].lit = inf;
              grid[r][c].colorIdx = 1; // copper on mouse
            }
          }
        }
      }

      // Draw grid
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = c * cw + gap / 2;
          const y = r * ch + gap / 2;
          const w = cw - gap;
          const h = ch - gap;

          const block = grid[r][c];
          const base = 0.04 + Math.sin(time + r * 0.5 + c * 0.3) * 0.02;
          const lit = Math.max(base, block.lit);

          const col = PALETTE[block.lit > 0.1 ? block.colorIdx : 0];
          const [rr, gg, bb] = block.lit > 0.1 ? col : [60, 45, 35];

          // Glitch offset
          const glitchX = block.glitch > 0 ? (Math.random() - 0.5) * 4 * block.glitch : 0;
          const glitchY = block.glitch > 0 ? (Math.random() - 0.5) * 2 * block.glitch : 0;

          // Block fill
          ctx.fillStyle = `rgba(${rr}, ${gg}, ${bb}, ${lit * 0.8})`;
          ctx.beginPath();
          ctx.roundRect(x + glitchX, y + glitchY, w, h, 2);
          ctx.fill();

          // Block border
          ctx.strokeStyle = `rgba(${rr}, ${gg}, ${bb}, ${lit * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Inner glow on lit blocks
          if (lit > 0.3) {
            const grad = ctx.createRadialGradient(
              x + w / 2, y + h / 2, 0,
              x + w / 2, y + h / 2, Math.max(w, h)
            );
            grad.addColorStop(0, `rgba(${rr}, ${gg}, ${bb}, ${lit * 0.5})`);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      if (Math.random() < 0.08) {
        const col = Math.floor(mouse.current.x / (canvas.width / COLS));
        const row = Math.floor(mouse.current.y / (canvas.height / ROWS));
        triggerSignal(
          Math.max(0, Math.min(ROWS - 1, row)),
          Math.max(0, Math.min(COLS - 1, col))
        );
      }
    };
    const onMouseLeave = () => { mouse.current = { x: -999, y: -999, down: false }; };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(autoInterval);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
