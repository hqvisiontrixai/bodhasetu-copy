"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import DotMatrix from "./DotMatrix";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Large glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(ellipse, #A27B3D 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0">
            <DotMatrix />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A]/80" />
          </div>

          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-[#A27B3D]/20" />
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#A27B3D]/60 to-transparent" />

          <div className="relative z-10 text-center py-24 px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-xs font-medium text-[#C9A96E] tracking-widest uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A27B3D] animate-pulse" />
                Founding Institutions Program
              </div>

              <h2 className="font-display font-black text-5xl md:text-7xl text-cream tracking-tight mb-6 leading-tight">
                Build Smarter
                <br />
                <span className="text-gradient-gold">Classrooms With AI.</span>
              </h2>

              <p className="text-[#AC9F91] text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                Join forward-thinking educators and institutions who are
                transforming academic outcomes with AI-powered intelligence —
                before your competitors do.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  id="cta-section-button"
                  className="relative group"
                >
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#A27B3D] via-[#B76A32] to-[#A27B3D] opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300 cta-pulse" />
                  <div className="relative px-10 py-4 rounded-full bg-gradient-to-r from-[#A27B3D] to-[#B76A32] font-semibold text-[#0A0A0A] text-base flex items-center gap-3">
                    Get Early Access
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="group-hover:translate-x-1 transition-transform">
                      <path d="M3 9h12M8 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </Link>

                <p className="text-sm text-[#98815D]">
                  Free during early access · No commitment required
                </p>
              </div>

              {/* Social proof */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
                {[
                  { label: "Institutions Interested", val: "50+" },
                  { label: "Students Monitored", val: "10K+" },
                  { label: "Learning Gaps Caught", val: "Real-time" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="font-display font-black text-3xl text-gradient-gold">{item.val}</div>
                    <div className="text-xs text-[#98815D] mt-1 uppercase tracking-widest">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
