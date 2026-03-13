"use client";
import { useRef, useEffect, useState } from "react";

const GRID_COLS = 20;
const GRID_ROWS = 12;
const COLORS = [
  [162, 123, 61],   // gold
  [183, 106, 50],   // copper
  [45, 83, 81],     // teal
  [198, 67, 32],    // energy
  [152, 129, 93],   // neutral
];

export default function DotMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const el = canvasRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.w === 0) return;
    canvas.width = dimensions.w;
    canvas.height = dimensions.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellW = dimensions.w / GRID_COLS;
    const cellH = dimensions.h / GRID_ROWS;
    const dotR = Math.min(cellW, cellH) * 0.18;

    // Dot states: 0=dim, 1=activating, 2=bright, 3=fading
    const states: { phase: number; colorIdx: number; brightness: number }[][] = Array.from(
      { length: GRID_ROWS },
      () =>
        Array.from({ length: GRID_COLS }, () => ({
          phase: Math.random() * Math.PI * 2,
          colorIdx: Math.floor(Math.random() * COLORS.length),
          brightness: 0.05 + Math.random() * 0.1,
        }))
    );

    // Ripple effects
    const ripples: { row: number; col: number; t: number; color: number[] }[] = [];

    let animId: number;
    let time = 0;

    const propagate = (centerRow: number, centerCol: number, colorIdx: number) => {
      ripples.push({ row: centerRow, col: centerCol, t: 0, color: COLORS[colorIdx] });
    };

    // Auto propagation
    const autoPropagateInterval = setInterval(() => {
      const r = Math.floor(Math.random() * GRID_ROWS);
      const c = Math.floor(Math.random() * GRID_COLS);
      propagate(r, c, Math.floor(Math.random() * COLORS.length));
    }, 1200);

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.w, dimensions.h);
      time += 0.015;

      // Update ripples
      ripples.forEach((ripple) => {
        ripple.t += 0.06;
      });
      // Remove old ripples
      while (ripples.length > 8) ripples.shift();

      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const x = (col + 0.5) * cellW;
          const y = (row + 0.5) * cellH;

          // Base pulse
          const baseBrightness = 0.07 + Math.sin(states[row][col].phase + time * 0.7) * 0.04;
          let brightness = baseBrightness;
          let r = 80, g = 70, b = 60;

          // Mouse proximity
          const mx = mouse.current.x;
          const my = mouse.current.y;
          const distMouse = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
          const mouseRadius = 120;
          if (distMouse < mouseRadius) {
            const influence = 1 - distMouse / mouseRadius;
            brightness += influence * 0.8;
            const mc = COLORS[1]; // copper on hover
            r = mc[0];
            g = mc[1];
            b = mc[2];
          }

          // Ripple influence
          ripples.forEach((ripple) => {
            const dist = Math.sqrt((row - ripple.row) ** 2 + (col - ripple.col) ** 2);
            const waveFront = ripple.t * 3;
            const waveWidth = 2.5;
            if (Math.abs(dist - waveFront) < waveWidth) {
              const waveIntensity = (1 - Math.abs(dist - waveFront) / waveWidth) * (1 - ripple.t / 8);
              brightness += waveIntensity * 0.75;
              r = ripple.color[0];
              g = ripple.color[1];
              b = ripple.color[2];
            }
          });

          brightness = Math.min(brightness, 1);

          // Draw dot
          ctx.beginPath();
          ctx.arc(x, y, dotR * (0.8 + brightness * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
          ctx.fill();

          // Glow on bright dots
          if (brightness > 0.3) {
            const grad = ctx.createRadialGradient(x, y, 0, x, y, dotR * 3);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${brightness * 0.3})`);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, dotR * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      // Trigger ripple on move occasionally
      if (Math.random() < 0.05) {
        const col = Math.floor((e.clientX - rect.left) / cellW);
        const row = Math.floor((e.clientY - rect.top) / cellH);
        propagate(
          Math.max(0, Math.min(GRID_ROWS - 1, row)),
          Math.max(0, Math.min(GRID_COLS - 1, col)),
          Math.floor(Math.random() * COLORS.length)
        );
      }
    };

    const handleMouseLeave = () => {
      mouse.current = { x: -999, y: -999 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(autoPropagateInterval);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dimensions]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
