"use client";
import { useRef, useEffect } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Use ResizeObserver instead of window resize — doesn't fire on scroll
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    const colors = [
      "rgba(162, 123, 61,",
      "rgba(183, 106, 50,",
      "rgba(45, 83, 81,",
      "rgba(198, 67, 32,",
    ];

    const particles: {
      x: number; y: number; size: number;
      speedX: number; speedY: number; opacity: number;
      color: string; life: number; maxLife: number;
    }[] = [];

    const createParticle = () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: -(Math.random() * 1.5 + 0.5),
        opacity: Math.random() * 0.6 + 0.2,
        color,
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    };

    for (let i = 0; i < 80; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      const blobs = [
        { x: canvas.width * 0.15 + Math.sin(time * 0.7) * 60, y: canvas.height * 0.25 + Math.cos(time * 0.5) * 40, r: 380, color: "rgba(162, 123, 61, 0.07)" },
        { x: canvas.width * 0.75 + Math.cos(time * 0.6) * 70, y: canvas.height * 0.35 + Math.sin(time * 0.4) * 50, r: 320, color: "rgba(183, 106, 50, 0.06)" },
        { x: canvas.width * 0.5  + Math.sin(time * 0.3) * 50, y: canvas.height * 0.7  + Math.cos(time * 0.45) * 35, r: 280, color: "rgba(45, 83, 81, 0.08)" },
        { x: canvas.width * 0.85 + Math.cos(time * 0.8) * 45, y: canvas.height * 0.8  + Math.sin(time * 0.55) * 30, r: 200, color: "rgba(198, 67, 32, 0.04)" },
      ];

      blobs.forEach((blob) => {
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (Math.random() < 0.4 && particles.length < 120) particles.push(createParticle());

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.1
          ? lifeRatio * 10 * p.opacity
          : lifeRatio > 0.8
          ? (1 - lifeRatio) * 5 * p.opacity
          : p.opacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, alpha)})`;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) particles.splice(i, 1);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.9 }} />
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0A0A0A] via-[#0d0b09] to-[#0A0A0A]" />
    </>
  );
}
