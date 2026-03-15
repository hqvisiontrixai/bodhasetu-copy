"use client";

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
            MARKETING APPROACH IN <br />
            WEBSITE DEVELOPMENT <br />
            WITH OUTSTANDING DESIGN
          </p>
        </div>

        {/* CTA */}
        <nav className="flex flex-col items-end gap-2 font-mono text-[#FAF8F6]">
          <a href="#" className="text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity">
            Interested to start a project with us?
          </a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
            Let's talk →
          </a>
        </nav>

      </div>
    </footer>
  );
}
