"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import ScrollStack, { ScrollStackItem } from './ScrollStack'

// ─── Feature Data ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    num: "01",
    title: "AI Classroom\nEngagement Detection",
    tag: "Computer Vision",
    accent: "#A27B3D",
    accent2: "#C9A96E",
    body: "Computer vision powered by OpenCV, MediaPipe & YOLO tracks every student in real time — detecting yawning, drowsiness, phone use, hand-raising, and writing activity. A live engagement score is generated per topic, per lecture.",
    tech: ["OpenCV", "MediaPipe", "YOLO v8", "XGBoost", "DAiSEE"],
    bgFrom: "#100e08",
  },
  {
    num: "02",
    title: "Automatic Quiz\nGeneration from PPTs",
    tag: "Academic Intelligence",
    accent: "#B76A32",
    accent2: "#D4834A",
    body: "Upload any lecture presentation and the AI instantly analyzes its content, extracts key concepts, and generates a structured 20-question quiz — ready to deploy in under 60 seconds.",
    tech: ["LLM", "Document AI", "NLP", "Concept Extraction"],
    bgFrom: "#0f0b07",
  },
  {
    num: "03",
    title: "Learning Gap\nIntelligence",
    tag: "Gap Detection",
    accent: "#C64320",
    accent2: "#E05030",
    body: "AI cross-references quiz performance with class averages and surfaces exact knowledge gaps per student. \"You are behind 55% of students in Data Structures\" — triggered automatically, before the exam.",
    tech: ["Analytics Engine", "Percentile AI", "Anomaly Detection"],
    bgFrom: "#110807",
  },
  {
    num: "04",
    title: "Personalized\nStudy Roadmaps",
    tag: "Adaptive Learning",
    accent: "#2D5351",
    accent2: "#3D7270",
    body: "Weak topics are added to a personal To-Study list — with PPT-derived explanations, curated examples, practice problems, and a structured one-week completion timeline.",
    tech: ["Personalization AI", "Auto-Curriculum", "LLM"],
    bgFrom: "#070f0e",
  },
  {
    num: "05",
    title: "Student Analytics\nDashboard",
    tag: "Student Experience",
    accent: "#A27B3D",
    accent2: "#C9A96E",
    body: "Every student gets a rich personal dashboard — performance graphs, subject analytics, attendance, quiz history, learning velocity, and anonymous percentile comparisons against classmates.",
    tech: ["Real-time Charts", "Percentile Graphs", "Progress Tracking"],
    bgFrom: "#100e08",
  },
  {
    num: "06",
    title: "Teacher Insight\nDashboard",
    tag: "Educator Intelligence",
    accent: "#B76A32",
    accent2: "#D4834A",
    body: "Teachers see live engagement heatmaps, topic-level interaction data, flagged weak concepts, quiz analytics, and full class learning trajectories — without any manual data collection.",
    tech: ["Heatmaps", "Topic Analytics", "AI Alerts", "Class Reports"],
    bgFrom: "#0f0b07",
  },
  {
    num: "07",
    title: "AI Mental\nWellness Support",
    tag: "Student Wellbeing",
    accent: "#2D5351",
    accent2: "#3D7270",
    body: "An empathetic AI companion available around the clock — supporting students through academic pressure, exam anxiety, and motivation dips with personalized, contextual guidance.",
    tech: ["Conversational AI", "Wellness NLP", "Sentiment Analysis"],
    bgFrom: "#070f0e",
  },
];

// ─── Visualizations ────────────────────────────────────────────────────────────
function EngagementViz({ accent }: { accent: string }) {
  const students = Array.from({ length: 35 }, (_, i) => ({ level: (Math.sin(i * 1.7) + 1) / 2, alert: [4, 12, 19, 28].includes(i) }));
  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-[10px]" style={{ color: accent }}><span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />LIVE · Room 204</span>
      </div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {students.map((s, i) => (
          <motion.div key={i} animate={{ scale: s.alert ? [1, 1.15, 1] : 1, opacity: [0.6, 1, 0.6] }} transition={{ duration: 2 + s.level, repeat: Infinity, delay: i * 0.04 }}
            className="aspect-square rounded-full" style={{ background: s.alert ? "rgba(198,67,32,0.7)" : `${accent}${Math.round((0.25 + s.level * 0.6) * 255).toString(16).padStart(2, "0")}`, boxShadow: s.alert ? `0 0 10px #C6432060` : "none" }} />
        ))}
      </div>
      <div className="flex gap-5 mt-5">
        {[["24", "Attentive", accent], ["5", "Drowsy", "#C64320"], ["6", "Distracted", "#B76A32"]].map(([v, l, c]) => (
          <div key={l}><div className="font-display font-black text-xl" style={{ color: c }}>{v}</div><div className="text-[10px] text-[#98815D] uppercase tracking-widest">{l}</div></div>
        ))}
      </div>
    </div>
  );
}

function QuizViz({ accent }: { accent: string }) {
  const qs = ["What is Big-O of QuickSort?", "Define dynamic programming.", "Explain recursion base case.", "Compare BFS and DFS."];
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <div className="glass rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-3 mb-3"><span className="text-2xl">📄</span>
          <div className="flex-1"><div className="text-xs font-medium text-cream">DS_Lecture3.pptx</div>
            <div className="h-1.5 mt-2 rounded-full bg-white/5 overflow-hidden"><motion.div animate={{ width: ["5%", "100%", "5%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #C9A96E)` }} /></div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: `${accent}20`, color: accent }}>AI →</span>
        </div>
      </div>
      {qs.map((q, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 + 0.4 }} className="glass rounded-lg px-3 py-2.5 flex gap-2 border border-white/5">
          <span className="text-[10px] font-bold mt-0.5" style={{ color: accent }}>Q{i + 1}</span><span className="text-xs text-[#AC9F91]">{q}</span>
        </motion.div>
      ))}
    </div>
  );
}

function GapViz({ accent }: { accent: string }) {
  const topics = [["Arrays", 88], ["Recursion", 42], ["Sorting", 55], ["Data Str.", 38], ["Graphs", 61], ["DP", 31]] as const;
  return (
    <div className="w-full max-w-xs flex flex-col gap-3">
      <div className="glass rounded-xl p-5 border border-white/5">
        <div className="text-[10px] text-[#98815D] uppercase tracking-widest mb-4">Student Performance Map</div>
        {topics.map(([name, val], i) => (
          <div key={name} className="flex items-center gap-3 mb-3">
            <span className="text-[11px] text-[#AC9F91] w-14 text-right">{name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-full" style={{ background: val < 50 ? "linear-gradient(90deg,#C64320,#E05030)" : `linear-gradient(90deg,${accent},#C9A96E)` }} /></div>
            <span className="text-[11px] font-bold w-8" style={{ color: val < 50 ? "#C64320" : accent }}>{val}%</span>
          </div>
        ))}
      </div>
      <div className="glass rounded-xl px-4 py-2.5 border border-[#C64320]/25 bg-[#C64320]/5"><span className="text-xs text-[#E05030]">⚠ Arjun is behind <strong>55%</strong> of class in Data Structures</span></div>
    </div>
  );
}

function RoadmapViz({ accent }: { accent: string }) {
  const days = [{ day: "Mon", topic: "Recursion Basics", done: true }, { day: "Tue", topic: "Sorting Algorithms", done: true }, { day: "Wed", topic: "Dynamic Programming", current: true }, { day: "Thu", topic: "Data Structures" }, { day: "Fri", topic: "Graph Traversal" }];
  return (
    <div className="w-full max-w-xs flex flex-col gap-2">
      {days.map((d, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${d.current ? "border-[#2D5351]/50 bg-[#2D5351]/10" : d.done ? "border-white/5 opacity-55" : "border-white/5"}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${d.done ? "bg-[#A27B3D] text-[#0A0A0A]" : d.current ? "border-2 border-[#2D5351] text-[#3D7270]" : "border border-white/10 text-[#98815D]"}`}>{d.done ? "✓" : i + 1}</div>
          <div className="flex-1"><div className="text-[11px] font-semibold text-cream">{d.topic}</div><div className="text-[10px] text-[#98815D]">{d.day} · AI practice set</div></div>
          {d.current && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${accent}25`, color: accent }}>Today</span>}
        </motion.div>
      ))}
    </div>
  );
}

function DashboardViz({ accent }: { accent: string }) {
  const weeks = [62, 74, 68, 81, 77, 89, 84];
  return (
    <div className="w-full max-w-xs flex flex-col gap-3">
      <div className="glass rounded-xl p-5 border border-white/5">
        <div className="flex justify-between items-start mb-5">
          <div><div className="text-sm font-semibold text-cream">Arjun Mehta</div><div className="text-[10px] text-[#98815D]">Grade 11 · CS</div></div>
          <div className="text-right"><div className="font-display font-black text-2xl" style={{ color: accent }}>84%</div><div className="text-[10px] text-[#98815D]">Overall</div></div>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {weeks.map((v, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.07, duration: 0.6 }} className="flex-1 rounded-t-sm" style={{ background: i === 6 ? accent : `${accent}50` }} />
          ))}
        </div>
        <div className="flex justify-between mt-1">{["W1","W2","W3","W4","W5","W6","W7"].map(w => <span key={w} className="text-[9px] text-[#98815D] flex-1 text-center">{w}</span>)}</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[["Top 18%","Rank"],["92%","Attend."],["4","To Study"]].map(([v,l]) => (
          <div key={l} className="glass rounded-xl p-3 text-center border border-white/5"><div className="font-display font-black" style={{ color: accent }}>{v}</div><div className="text-[9px] text-[#98815D] mt-0.5">{l}</div></div>
        ))}
      </div>
    </div>
  );
}

function TeacherViz({ accent }: { accent: string }) {
  const slides = Array.from({ length: 28 }, (_, i) => ({ n: i + 1, e: (Math.sin(i) + 1) / 2, flag: [10,14,22].includes(i+1) }));
  return (
    <div className="w-full max-w-xs flex flex-col gap-3">
      <div className="text-[10px] text-[#98815D] uppercase tracking-widest">Engagement Heatmap · DS Lecture 3</div>
      <div className="glass rounded-xl p-4 border border-white/5">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
          {slides.map((s) => (
            <motion.div key={s.n} animate={s.flag ? { opacity: [0.7, 1, 0.7] } : {}} transition={{ duration: 1.4, repeat: Infinity }} className="aspect-square rounded-md flex items-center justify-center text-[9px] font-bold"
              style={{ background: s.flag ? "rgba(198,67,32,0.55)" : `rgba(${Math.round(45+s.e*117)},${Math.round(51+s.e*72)},30,${0.2+s.e*0.7})`, color: s.flag ? "#FAF8F6" : "#98815D", border: s.flag ? "1px solid #C6432040" : "1px solid transparent" }}>{s.n}</motion.div>
          ))}
        </div>
        <div className="mt-3 text-[10px] text-[#C64320] flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#C64320]" />3 slides with low engagement</div>
      </div>
    </div>
  );
}

function WellnessViz({ accent }: { accent: string }) {
  const msgs = [{ from: "s", text: "I'm really stressed about my exams next week." }, { from: "ai", text: "I hear you. Which subject feels most overwhelming right now?" }, { from: "s", text: "Data Structures. I feel like I'll never get graphs." }, { from: "ai", text: "Graphs take time — your quiz shows you already get BFS. Want a walkthrough of DFS?" }];
  return (
    <div className="w-full max-w-sm flex flex-col gap-2">
      <div className="text-[10px] text-[#98815D] uppercase tracking-widest mb-1">AI Wellness Assistant</div>
      {msgs.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.22 }} className={`flex ${m.from === "s" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${m.from === "s" ? "bg-white/6 text-cream rounded-tr-sm" : "rounded-tl-sm"}`} style={m.from === "ai" ? { background: `${accent}20`, border: `1px solid ${accent}30`, color: "#FAF8F6" } : {}}>
            {m.from === "ai" && <span className="block text-[9px] uppercase tracking-widest mb-1" style={{ color: accent }}>Bodha AI</span>}
            {m.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const VIZS = [EngagementViz, QuizViz, GapViz, RoadmapViz, DashboardViz, TeacherViz, WellnessViz];

// ─── Individual Absolute Stacking Card ───────────────────────────────────────
function StackCard({ feature, index, total, progress }: { feature: typeof FEATURES[0]; index: number; total: number; progress: MotionValue<number> }) {
  const Viz = VIZS[index];

  // Each card's scroll segment calculations (assuming equal height per card in the 700vh container)
  // Progress goes from 0 to 1 over 700vh.
  // Card `index` enters between (index - 1)/total and index/total
  // Card `index` stays full from index/total to (index + 0.5)/total
  // Card `index` starts shrinking/fading away between (index + 0.5)/total and (index + 1)/total
  
  // Calculate entrance (sliding up from bottom)
  const entryStart = (index - 0.5) / total;
  const entryEnd = index / total;
  
  // Calculate exit (shrinking and fading)
  const exitStart = (index + 0.5) / total;
  const exitEnd = (index + 1) / total;

  // y position: slides up smoothly from 100vh
  const y = useTransform(
    progress,
    [entryStart, entryEnd, exitStart, exitEnd],
    ["100vh", "0vh", "0vh", "-10vh"]
  );

  // scale: shrinks slightly as it gets covered by the next card
  const scale = useTransform(
    progress,
    [exitStart, exitEnd],
    [1, 0.88]
  );

  // opacity: fades out as it gets covered
  const opacity = useTransform(
    progress,
    [entryStart, entryEnd, exitStart, exitEnd],
    [0.2, 1, 1, 0] // Fade in -> solid -> solid -> fade out
  );

  return (
    <motion.div
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        zIndex: index + 1,
        y,
        scale,
        opacity,
        transformOrigin: "top center",
        background: `linear-gradient(135deg, ${feature.bgFrom} 0%, #0A0A0A 100%)`,
        boxShadow: "0 -20px 40px rgba(0,0,0,0.5)", // Shadow helps separation of stacked cards
      }}
    >
      {/* Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent 10%, ${feature.accent}50, transparent 90%)` }} />

      {/* Corner glow */}
      <div className="absolute top-1/4 right-8 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${feature.accent}12 0%, transparent 70%)`, filter: "blur(70px)" }} />

      {/* Top meta bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-10 md:px-20 py-5">
        <div className="flex items-center gap-2">
          <div className="w-px h-3.5 rounded-full" style={{ background: feature.accent }} />
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: feature.accent }}>{feature.tag}</span>
        </div>
        {/* Progress pips */}
        <div className="flex items-center gap-2">
          {FEATURES.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300"
              style={{ width: i === index ? "20px" : "5px", height: "5px",
                background: i === index ? feature.accent : `${feature.accent}30` }} />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-7xl mx-auto px-10 md:px-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-20 pt-14">
        {/* Left */}
        <div className="flex-1 min-w-0">
          {/* Big number */}
          <div className="font-display font-black leading-none select-none mb-2"
            style={{ fontSize: "clamp(5rem, 12vw, 10rem)", color: `${feature.accent}14`, WebkitTextStroke: `1px ${feature.accent}20` }}>
            {feature.num}
          </div>
          {/* Title */}
          <h2 className="font-display font-black leading-[1.0] tracking-tight text-cream mb-5"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", marginTop: "-1.5rem" }}>
            {feature.title.split("\n").map((line, li) => (
              <span key={li} className="block">{li === 1 ? <span style={{ color: feature.accent2 }}>{line}</span> : line}</span>
            ))}
          </h2>
          <p className="text-[#AC9F91] text-base leading-relaxed max-w-md mb-7">{feature.body}</p>
          <div className="flex flex-wrap gap-2">
            {feature.tech.map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                style={{ color: feature.accent, borderColor: `${feature.accent}30`, background: `${feature.accent}08` }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right viz */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="relative p-8 rounded-3xl" style={{ background: `${feature.accent}06`, border: `1px solid ${feature.accent}14`, minWidth: "320px" }}>
            {/* Subtle scan lines */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none" style={{ opacity: 0.03 }}>
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="absolute left-0 right-0 h-px" style={{ top: `${i * 3.7}%`, background: feature.accent }} />
              ))}
            </div>
            <Viz accent={feature.accent} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Global Scroll Section ───────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative bg-[#0A0A0A] text-cream py-32"
    >
      {/* Intro */}
      <div className="max-w-4xl mx-auto text-center mb-24 px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A27B3D] animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#A27B3D]">
            7 Intelligence Layers
          </span>
        </div>

        <h2
          className="font-display font-black leading-tight"
          style={{ fontSize: "clamp(2rem,5vw,4rem)" }}
        >
          Every Dimension of <br />
          <span className="text-gradient-gold">
            Student Intelligence.
          </span>
        </h2>

        <p className="text-[#98815D] text-sm mt-4">
          Scroll to explore ↓
        </p>
      </div>

      <ScrollStack
        useWindowScroll
        itemDistance={160}
        itemScale={0.04}
        itemStackDistance={40}
        baseScale={0.9}
        rotationAmount={0}
        blurAmount={0} 
        
        onStackComplete      >
        {FEATURES.map((feature, index) => {
          const Viz = VIZS[index];

          return (
            <ScrollStackItem key={feature.num}>
              <div
                className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${feature.bgFrom} 0%, #0A0A0A 100%)`,
                  border: `1px solid ${feature.accent}20`,
                }}
              >
                {/* Accent top line */}
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent 10%, ${feature.accent}50, transparent 90%)`,
                  }}
                />

                {/* Card content */}
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 px-10 md:px-20 py-24">
                  
                  {/* LEFT SIDE */}
                  <div className="flex-1">

                    {/* number */}
                    <div
                      className="font-display font-black leading-none select-none mb-2"
                      style={{
                        fontSize: "clamp(5rem,12vw,10rem)",
                        color: `${feature.accent}14`,
                        WebkitTextStroke: `1px ${feature.accent}20`,
                      }}
                    >
                      {feature.num}
                    </div>

                    {/* title */}
                    <h2
                      className="font-display font-black leading-[1.0] tracking-tight text-cream mb-5"
                      style={{
                        fontSize: "clamp(1.8rem,3.5vw,3rem)",
                        marginTop: "-1.5rem",
                      }}
                    >
                      {feature.title.split("\n").map((line, li) => (
                        <span key={li} className="block">
                          {li === 1 ? (
                            <span style={{ color: feature.accent2 }}>
                              {line}
                            </span>
                          ) : (
                            line
                          )}
                        </span>
                      ))}
                    </h2>

                    {/* description */}
                    <p className="text-[#AC9F91] text-base leading-relaxed max-w-md mb-7">
                      {feature.body}
                    </p>

                    {/* tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {feature.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                          style={{
                            color: feature.accent,
                            borderColor: `${feature.accent}30`,
                            background: `${feature.accent}08`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT SIDE VISUAL */}
                  <div className="hidden lg:flex flex-1 items-center justify-center">
                    <div
                      className="relative p-8 rounded-3xl"
                      style={{
                        background: `${feature.accent}06`,
                        border: `1px solid ${feature.accent}14`,
                        minWidth: "320px",
                      }}
                    >
                      {/* scanlines */}
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                        style={{ opacity: 0.03 }}
                      >
                        {Array.from({ length: 28 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute left-0 right-0 h-px"
                            style={{
                              top: `${i * 3.7}%`,
                              background: feature.accent,
                            }}
                          />
                        ))}
                      </div>

                      <Viz accent={feature.accent} />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
    </section>
  );
}

