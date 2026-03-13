"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GlitchGrid from "./GlitchGrid";

const ANALYTICS_ITEMS = [
  {
    title: "Attention Heatmap",
    description: "Visual map of class attention throughout a lecture — per slide, per minute.",
    metric: "92%",
    metricLabel: "Accuracy",
    color: "#A27B3D",
  },
  {
    title: "Engagement Score",
    description: "Composite score combining attention, interaction, and activity signals.",
    metric: "real-time",
    metricLabel: "Updates",
    color: "#B76A32",
  },
  {
    title: "Topic Weak Zones",
    description: "Topics where class engagement dropped significantly below average.",
    metric: "< 1s",
    metricLabel: "Detection",
    color: "#2D5351",
  },
];

export default function AnalyticsSection() {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <section id="analytics" className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: GlitchGrid visualization */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video">
              <GlitchGrid />
              {/* Overlay labels */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#A27B3D] animate-pulse" />
                  <span className="text-[10px] text-[#C9A96E] font-mono uppercase tracking-widest">
                    Live Classroom Signal
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 text-right">
                  <div className="text-xs text-[#AC9F91] font-mono">38 students · Room 204</div>
                  <div className="text-[10px] text-[#98815D] font-mono">Avg Engagement: 74%</div>
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 glass-gold rounded-xl p-4 border border-[#A27B3D]/20"
            >
              <div className="text-xs text-[#C9A96E] mb-1 font-medium">Alert Sent</div>
              <div className="text-sm text-cream font-semibold">5 students drowsy</div>
              <div className="text-[10px] text-[#98815D] mt-1">Row 3 · 11:42 AM</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -left-6 glass rounded-xl p-4 border border-white/10"
            >
              <div className="text-xs text-[#AC9F91] mb-1 font-medium">Weak Topic Detected</div>
              <div className="text-sm text-cream font-semibold">Recursion — Grade 10B</div>
              <div className="text-[10px] text-[#98815D] mt-1">62% below average</div>
            </motion.div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-xs font-medium text-[#C9A96E] tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A27B3D]" />
              Intelligence Dashboard
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-cream tracking-tight mb-6 leading-tight">
              See Through Every
              <br />
              <span className="text-gradient-gold">Classroom Wall.</span>
            </h2>
            <p className="text-[#AC9F91] leading-relaxed mb-10">
              Bodha Setu gives teachers and administrators a live pulse of their
              classrooms — visualizing attention, flagging disengagement, and
              surfacing learning gaps the moment they occur.
            </p>

            {/* Tabbed items */}
            <div className="flex flex-col gap-3">
              {ANALYTICS_ITEMS.map((item, i) => (
                <button
                  key={item.title}
                  onClick={() => setActiveItem(i)}
                  className={`text-left p-5 rounded-xl border transition-all duration-300 ${
                    activeItem === i
                      ? "border-[#A27B3D]/40 bg-[#A27B3D]/05"
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: activeItem === i ? item.color : "#FAF8F6" }}
                    >
                      {item.title}
                    </span>
                    <AnimatePresence>
                      {activeItem === i && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <span className="font-display font-black text-lg" style={{ color: item.color }}>
                            {item.metric}
                          </span>
                          <span className="text-[10px] text-[#98815D] uppercase tracking-widest">
                            {item.metricLabel}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {activeItem === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-[#AC9F91]"
                      >
                        {item.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
