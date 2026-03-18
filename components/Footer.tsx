"use client";
import Image from "next/image";

export default function SegmintFooter() {
  return (
    <footer className="w-full bg-[#0A0A0A] px-10 py-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-end justify-between gap-10">

        {/* Brand */}
        <span className="block text-[clamp(40px,8vw,80px)] font-bold text-[#d8d6d3] tracking-tighter uppercase leading-[0.75]">
          <span className="block">VisiontriX</span>
          <span className="block mt-2 text-[#B76A32]">AI</span>
        </span>

        {/* Tagline */}
        <div className="hidden md:flex gap-4 max-w-[400px] font-mono">
          <span className="text-[20px] text-[#FAF8F6] font-bold">—</span>
          <p className="text-[11px] uppercase tracking-[0.15em] leading-relaxed text-[#FAF8F6] font-semibold">
            Understanding Every Student,<br />
            In Real Time.
          </p>
        </div>

        {/* CTA */}
        <nav className="flex flex-col items-end gap-2 font-mono text-[#FAF8F6]">
          <span className="text-[10px] uppercase tracking-widest opacity-70">
            Interested to start a project with us?
          </span>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=visiontrixai@gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Let's talk →
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-5 mt-4">
            <a 
              href="https://instagram.com/visiontrixai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity flex items-center justify-center"
            >
              <Image 
                src="/instagram.png" 
                alt="Instagram" 
                width={18} 
                height={18} 
                className="invert opacity-90" 
              />
            </a>
            <a 
              href="https://www.linkedin.com/company/visiontrix-ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Image 
                src="/linkedin.png" 
                alt="LinkedIn" 
                width={18} 
                height={18} 
                className="invert opacity-90" 
              />
            </a>
            <a 
              href="https://x.com/VisiontriXAI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Image 
                src="/twitter.png" 
                alt="Twitter" 
                width={18} 
                height={18} 
                className="invert opacity-90" 
              />
            </a>
          </div>
        </nav>

      </div>
    </footer>
  );
}
