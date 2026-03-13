"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TECH_LAYERS = [
  {
    layer: "Vision Layer",
    color: "#A27B3D",
    items: ["OpenCV", "MediaPipe", "YOLO v8", "XGBoost", "DAiSEE Dataset"],
    description: "Computer vision stack that interprets student body language, facial expressions, and classroom activity in real time.",
  },
  {
    layer: "Intelligence Layer",
    color: "#B76A32",
    items: ["Large Language Models", "Quiz Generation AI", "Concept Extraction", "NLP Pipeline", "Document AI"],
    description: "LLM-powered academic intelligence that transforms lecture content into evaluations and actionable insights.",
  },
  {
    layer: "Analytics Layer",
    color: "#2D5351",
    items: ["Learning Gap Engine", "Percentile Analysis", "Engagement Heatmaps", "Progress Tracking", "Predictive Models"],
    description: "Deep analytics that surface knowledge gaps, track academic trajectories, and trigger timely interventions.",
  },
];

export default function TechnologySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="technology" ref={ref} className="relative py-32 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-5"
          style={{ background: "radial-gradient(ellipse, #A27B3D 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-xs font-medium text-[#C9A96E] tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A27B3D]" />
            Three Intelligence Layers
          </div>
          <h2 className="font-display font-black text-5xl md:text-6xl text-cream tracking-tight mb-6 leading-tight">
            Engineered for
            <br />
            <span className="text-gradient-warm">Classroom Reality.</span>
          </h2>
          <p className="text-[#AC9F91] text-lg max-w-2xl mx-auto">
            A multi-layer AI architecture that sees, understands, and acts on
            classroom intelligence — in real time.
          </p>
        </motion.div>

        {/* Tech layer cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {TECH_LAYERS.map((layer, i) => (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative glass rounded-2xl p-8 border border-white/5 group hover:border-opacity-100 overflow-hidden transition-all duration-500"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${layer.color}10 0%, transparent 70%)` }}
              />
              <div
                className="absolute top-0 left-6 right-6 h-px opacity-50"
                style={{ background: `linear-gradient(90deg, transparent, ${layer.color}60, transparent)` }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full" style={{ background: layer.color }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: layer.color }}>
                    {layer.layer}
                  </span>
                </div>

                <p className="text-sm text-[#AC9F91] mb-6 leading-relaxed">
                  {layer.description}
                </p>

                <div className="flex flex-col gap-2">
                  {layer.items.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full" style={{ background: layer.color, opacity: 0.6 }} />
                      <span className="text-sm text-[#FAF8F6]/70 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="glass rounded-2xl border border-white/5 p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <h3 className="font-display font-bold text-2xl text-cream mb-2">
              How Bodha Setu Works
            </h3>
            <p className="text-sm text-[#AC9F91]">From classroom to actionable insight in under one second</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {[
              { icon: "📹", label: "Classroom Camera", sublabel: "Vision Input" },
              { icon: "🧠", label: "AI Analysis", sublabel: "Real-time Processing" },
              { icon: "📊", label: "Insights Engine", sublabel: "Gap Detection" },
              { icon: "👨‍🏫", label: "Teacher Dashboard", sublabel: "Actionable Reports" },
              { icon: "📚", label: "Student Path", sublabel: "Personalized Learning" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl glass-gold flex items-center justify-center text-2xl border border-[#A27B3D]/20">
                    {step.icon}
                  </div>
                  <span className="text-xs font-medium text-cream text-center">{step.label}</span>
                  <span className="text-[10px] text-[#98815D] text-center">{step.sublabel}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <motion.div
                      animate={{ scaleX: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      className="w-12 h-px origin-left"
                      style={{ background: `linear-gradient(90deg, #A27B3D40, #A27B3D, #A27B3D40)` }}
                    />
                    <div className="w-0 h-0 border-l-4 border-l-[#A27B3D] border-y-2 border-y-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
