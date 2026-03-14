"use client";
import { memo, useRef, useEffect } from "react";

const FEATURES = [
  { num:"01", title:"AI Classroom\nEngagement Detection",   tag:"Computer Vision",      accent:"#A27B3D", accent2:"#C9A96E", body:"Computer vision powered by OpenCV, MediaPipe & YOLO tracks every student in real time — detecting yawning, drowsiness, phone use, hand-raising, and writing activity. A live engagement score is generated per topic, per lecture.", tech:["OpenCV","MediaPipe","YOLO v8","XGBoost","DAiSEE"], bgFrom:"#100e08" },
  { num:"02", title:"Automatic Quiz\nGeneration from PPTs", tag:"Academic Intelligence", accent:"#B76A32", accent2:"#D4834A", body:"Upload any lecture presentation and the AI instantly analyzes its content, extracts key concepts, and generates a structured 20-question quiz — ready to deploy in under 60 seconds.", tech:["LLM","Document AI","NLP","Concept Extraction"], bgFrom:"#0f0b07" },
  { num:"03", title:"Learning Gap\nIntelligence",           tag:"Gap Detection",          accent:"#C64320", accent2:"#E05030", body:'AI cross-references quiz performance with class averages and surfaces exact knowledge gaps per student. "You are behind 55% of students in Data Structures" — triggered automatically, before the exam.', tech:["Analytics Engine","Percentile AI","Anomaly Detection"], bgFrom:"#110807" },
  { num:"04", title:"Personalized\nStudy Roadmaps",         tag:"Adaptive Learning",      accent:"#2D5351", accent2:"#3D7270", body:"Weak topics are added to a personal To-Study list — with PPT-derived explanations, curated examples, practice problems, and a structured one-week completion timeline.", tech:["Personalization AI","Auto-Curriculum","LLM"], bgFrom:"#070f0e" },
  { num:"05", title:"Student Analytics\nDashboard",         tag:"Student Experience",     accent:"#A27B3D", accent2:"#C9A96E", body:"Every student gets a rich personal dashboard — performance graphs, subject analytics, attendance, quiz history, learning velocity, and anonymous percentile comparisons against classmates.", tech:["Real-time Charts","Percentile Graphs","Progress Tracking"], bgFrom:"#100e08" },
  { num:"06", title:"Teacher Insight\nDashboard",           tag:"Educator Intelligence",  accent:"#B76A32", accent2:"#D4834A", body:"Teachers see live engagement heatmaps, topic-level interaction data, flagged weak concepts, quiz analytics, and full class learning trajectories — without any manual data collection.", tech:["Heatmaps","Topic Analytics","AI Alerts","Class Reports"], bgFrom:"#0f0b07" },
  { num:"07", title:"AI Mental\nWellness Support",          tag:"Student Wellbeing",      accent:"#2D5351", accent2:"#3D7270", body:"An empathetic AI companion available around the clock — supporting students through academic pressure, exam anxiety, and motivation dips with personalized, contextual guidance.", tech:["Conversational AI","Wellness NLP","Sentiment Analysis"], bgFrom:"#070f0e" },
];

const GLOBAL_CSS = `
  @keyframes viz-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes viz-alert { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  @keyframes bar-slide { 0%{width:5%} 50%{width:100%} 100%{width:5%} }
  @keyframes bar-grow  { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }
  @keyframes bar-up    { from{transform:scaleY(0);transform-origin:bottom} to{transform:scaleY(1);transform-origin:bottom} }
  @keyframes fi-right  { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fi-up     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .stack-card {
    position: sticky;
    width: 100%;
    will-change: transform;
    transform-origin: top center;
    backface-visibility: hidden;
    transform: translate3d(0,0,0);
  }
`;

// ─── Visualizations ───────────────────────────────────────────────────────────
const EngagementViz = memo(({ accent }: { accent: string }) => {
  const students = Array.from({ length: 35 }, (_, i) => ({ level: (Math.sin(i * 1.7) + 1) / 2, alert: [4,12,19,28].includes(i) }));
  return (
    <div className="w-full max-w-xs">
      <div className="grid gap-2.5" style={{ gridTemplateColumns:"repeat(7,1fr)" }}>
        {students.map((s, i) => (
          <div key={i} className="aspect-square rounded-full" style={{ animationName:s.alert?"viz-alert":"viz-pulse", animationDuration:`${2+s.level}s`, animationTimingFunction:"ease-in-out", animationIterationCount:"infinite", animationDelay:`${i*0.04}s`, background:s.alert?"rgba(198,67,32,0.7)":`${accent}${Math.round((0.25+s.level*0.6)*255).toString(16).padStart(2,"0")}`, boxShadow:s.alert?"0 0 10px #C6432060":"none" }} />
        ))}
      </div>
      <div className="flex gap-5 mt-5">
        {([["24","Attentive",accent],["5","Drowsy","#C64320"],["6","Distracted","#B76A32"]] as const).map(([v,l,c]) => (
          <div key={l}><div className="font-black text-xl" style={{ color:c }}>{v}</div><div className="text-[10px] uppercase tracking-widest" style={{ color:"#98815D" }}>{l}</div></div>
        ))}
      </div>
    </div>
  );
});
EngagementViz.displayName = "EngagementViz";

const QuizViz = memo(({ accent }: { accent: string }) => {
  const qs = ["What is Big-O of QuickSort?","Define dynamic programming.","Explain recursion base case.","Compare BFS and DFS."];
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <div className="rounded-xl p-4 border border-white/5" style={{ background:"rgba(255,255,255,0.03)" }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">📄</span>
          <div className="flex-1">
            <div className="text-xs font-medium" style={{ color:"#FAF8F6" }}>DS_Lecture3.pptx</div>
            <div className="h-1.5 mt-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full" style={{ background:`linear-gradient(90deg,${accent},#C9A96E)`, animationName:"bar-slide", animationDuration:"3s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }} />
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-md" style={{ background:`${accent}20`, color:accent }}>AI →</span>
        </div>
      </div>
      {qs.map((q,i) => (
        <div key={i} className="rounded-lg px-3 py-2.5 flex gap-2 border border-white/5" style={{ background:"rgba(255,255,255,0.03)", animationName:"fi-right", animationDuration:"0.4s", animationFillMode:"both", animationDelay:`${i*0.15}s` }}>
          <span className="text-[10px] font-bold mt-0.5" style={{ color:accent }}>Q{i+1}</span>
          <span className="text-xs" style={{ color:"#AC9F91" }}>{q}</span>
        </div>
      ))}
    </div>
  );
});
QuizViz.displayName = "QuizViz";

const GapViz = memo(({ accent }: { accent: string }) => {
  const topics: [string,number][] = [["Arrays",88],["Recursion",42],["Sorting",55],["Data Str.",38],["Graphs",61],["DP",31]];
  return (
    <div className="w-full max-w-xs flex flex-col gap-3">
      <div className="rounded-xl p-5 border border-white/5" style={{ background:"rgba(255,255,255,0.03)" }}>
        <div className="text-[10px] uppercase tracking-widest mb-4" style={{ color:"#98815D" }}>Student Performance Map</div>
        {topics.map(([name,val],i) => (
          <div key={name} className="flex items-center gap-3 mb-3">
            <span className="text-[11px] w-14 text-right" style={{ color:"#AC9F91" }}>{name}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full" style={{ width:`${val}%`, background:val<50?"linear-gradient(90deg,#C64320,#E05030)":`linear-gradient(90deg,${accent},#C9A96E)`, animationName:"bar-grow", animationDuration:"0.8s", animationFillMode:"both", animationTimingFunction:"ease-out", animationDelay:`${i*0.1}s` }} />
            </div>
            <span className="text-[11px] font-bold w-8" style={{ color:val<50?"#C64320":accent }}>{val}%</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl px-4 py-2.5 border border-[#C64320]/25" style={{ background:"rgba(198,67,32,0.05)" }}>
        <span className="text-xs" style={{ color:"#E05030" }}>⚠ Arjun is behind <strong>55%</strong> of class in Data Structures</span>
      </div>
    </div>
  );
});
GapViz.displayName = "GapViz";

const RoadmapViz = memo(({ accent }: { accent: string }) => {
  const days = [{ day:"Mon",topic:"Recursion Basics",done:true,current:false },{ day:"Tue",topic:"Sorting Algorithms",done:true,current:false },{ day:"Wed",topic:"Dynamic Programming",done:false,current:true },{ day:"Thu",topic:"Data Structures",done:false,current:false },{ day:"Fri",topic:"Graph Traversal",done:false,current:false }];
  return (
    <div className="w-full max-w-xs flex flex-col gap-2">
      {days.map((d,i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ borderColor:d.current?"rgba(45,83,81,0.5)":"rgba(255,255,255,0.05)", background:d.current?"rgba(45,83,81,0.1)":"transparent", opacity:d.done&&!d.current?0.55:1, animationName:"fi-right", animationDuration:"0.4s", animationFillMode:"both", animationDelay:`${i*0.1}s` }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background:d.done?"#A27B3D":"transparent", color:d.done?"#0A0A0A":d.current?"#3D7270":"#98815D", border:d.done?"none":d.current?"2px solid #2D5351":"1px solid rgba(255,255,255,0.1)" }}>{d.done?"✓":i+1}</div>
          <div className="flex-1"><div className="text-[11px] font-semibold" style={{ color:"#FAF8F6" }}>{d.topic}</div><div className="text-[10px]" style={{ color:"#98815D" }}>{d.day} · AI practice set</div></div>
          {d.current&&<span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background:`${accent}25`,color:accent }}>Today</span>}
        </div>
      ))}
    </div>
  );
});
RoadmapViz.displayName = "RoadmapViz";

const DashboardViz = memo(({ accent }: { accent: string }) => {
  const weeks = [62,74,68,81,77,89,84];
  return (
    <div className="w-full max-w-xs flex flex-col gap-3">
      <div className="rounded-xl p-5 border border-white/5" style={{ background:"rgba(255,255,255,0.03)" }}>
        <div className="flex justify-between items-start mb-5">
          <div><div className="text-sm font-semibold" style={{ color:"#FAF8F6" }}>Arjun Mehta</div><div className="text-[10px]" style={{ color:"#98815D" }}>Grade 11 · CS</div></div>
          <div className="text-right"><div className="font-black text-2xl" style={{ color:accent }}>84%</div><div className="text-[10px]" style={{ color:"#98815D" }}>Overall</div></div>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {weeks.map((v,i) => <div key={i} className="flex-1 rounded-t-sm" style={{ height:`${v}%`, background:i===6?accent:`${accent}50`, animationName:"bar-up", animationDuration:"0.6s", animationFillMode:"both", animationTimingFunction:"ease-out", animationDelay:`${i*0.07}s` }} />)}
        </div>
        <div className="flex justify-between mt-1">{["W1","W2","W3","W4","W5","W6","W7"].map(w=><span key={w} className="text-[9px] flex-1 text-center" style={{ color:"#98815D" }}>{w}</span>)}</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[["Top 18%","Rank"],["92%","Attend."],["4","To Study"]].map(([v,l])=>(
          <div key={l} className="rounded-xl p-3 text-center border border-white/5" style={{ background:"rgba(255,255,255,0.03)" }}><div className="font-black" style={{ color:accent }}>{v}</div><div className="text-[9px] mt-0.5" style={{ color:"#98815D" }}>{l}</div></div>
        ))}
      </div>
    </div>
  );
});
DashboardViz.displayName = "DashboardViz";

const TeacherViz = memo(({ accent }: { accent: string }) => {
  const slides = Array.from({ length:28 },(_,i)=>({ n:i+1, e:(Math.sin(i)+1)/2, flag:[10,14,22].includes(i+1) }));
  return (
    <div className="w-full max-w-xs flex flex-col gap-3">
      <div className="text-[10px] uppercase tracking-widest" style={{ color:"#98815D" }}>Engagement Heatmap · DS Lecture 3</div>
      <div className="rounded-xl p-4 border border-white/5" style={{ background:"rgba(255,255,255,0.03)" }}>
        <div className="grid gap-1.5" style={{ gridTemplateColumns:"repeat(7,1fr)" }}>
          {slides.map(s=><div key={s.n} className="aspect-square rounded-md flex items-center justify-center text-[9px] font-bold" style={{ background:s.flag?"rgba(198,67,32,0.55)":`rgba(${Math.round(45+s.e*117)},${Math.round(51+s.e*72)},30,${0.2+s.e*0.7})`, color:s.flag?"#FAF8F6":"#98815D", border:s.flag?"1px solid #C6432040":"1px solid transparent", animationName:s.flag?"viz-pulse":undefined, animationDuration:"1.4s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }}>{s.n}</div>)}
        </div>
        <div className="mt-3 text-[10px] flex items-center gap-1.5" style={{ color:"#C64320" }}><span className="w-2 h-2 rounded-sm" style={{ background:"#C64320" }} />3 slides with low engagement</div>
      </div>
    </div>
  );
});
TeacherViz.displayName = "TeacherViz";

const WellnessViz = memo(({ accent }: { accent: string }) => {
  const msgs = [{ from:"s",text:"I'm really stressed about my exams next week." },{ from:"ai",text:"I hear you. Which subject feels most overwhelming right now?" },{ from:"s",text:"Data Structures. I feel like I'll never get graphs." },{ from:"ai",text:"Graphs take time — your quiz shows you already get BFS. Want a walkthrough of DFS?" }];
  return (
    <div className="w-full max-w-sm flex flex-col gap-2">
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color:"#98815D" }}>AI Wellness Assistant</div>
      {msgs.map((m,i)=>(
        <div key={i} className={`flex ${m.from==="s"?"justify-end":"justify-start"}`} style={{ animationName:"fi-up", animationDuration:"0.4s", animationFillMode:"both", animationDelay:`${i*0.18}s` }}>
          <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${m.from==="s"?"rounded-tr-sm":"rounded-tl-sm"}`} style={m.from==="ai"?{ background:`${accent}20`, border:`1px solid ${accent}30`, color:"#FAF8F6" }:{ background:"rgba(255,255,255,0.06)", color:"#FAF8F6" }}>
            {m.from==="ai"&&<span className="block text-[9px] uppercase tracking-widest mb-1" style={{ color:accent }}>Bodha AI</span>}
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
});
WellnessViz.displayName = "WellnessViz";

const VIZS = [EngagementViz, QuizViz, GapViz, RoadmapViz, DashboardViz, TeacherViz, WellnessViz];

// ─── Card ─────────────────────────────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Viz = VIZS[index];
  const stickyTop = 80 + index * 20;

  return (
    <div
      className="stack-card rounded-3xl overflow-hidden mb-6 w-full"
      style={{
        top: `${stickyTop}px`,
        background: `linear-gradient(135deg,${feature.bgFrom} 0%,#0A0A0A 100%)`,
        border: `1px solid ${feature.accent}20`,
        zIndex: index + 1,
      }}
    >
      {/* <div className="h-px w-full" style={{ background:`linear-gradient(90deg,transparent 10%,${feature.accent}50,transparent 90%)` }} /> */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ background:`radial-gradient(ellipse 55% 45% at 80% 35%,${feature.accent}1a 0%,transparent 70%)` }} />

      <div className="relative flex items-center justify-between px-8 md:px-14 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-px h-3.5 rounded-full" style={{ background:feature.accent }} />
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color:feature.accent }}>{feature.tag}</span>
        </div>
        <div className="flex items-center gap-2">
          {FEATURES.map((_,i) => (
            <div key={i} 
              style={{ 
                width:i===index?"20px":"5px", 
                height:"5px", 
                background:i===index?feature.accent:`${feature.accent}30`,
                borderRadius:"9999px",
                transition:"width 300ms ease-out, background-color 300ms ease",
                willChange: i===index || i===index-1 || i===index+1 ? "width" : "auto"
              }} />
          ))}
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-16 px-8 md:px-14 py-10">
        <div className="flex-1 min-w-0">
          <div className="font-black leading-none select-none mb-2" style={{ fontSize:"clamp(4rem,10vw,8rem)", color:`${feature.accent}14`, WebkitTextStroke:`1px ${feature.accent}20` }}>
            {feature.num}
          </div>
          <h2 className="font-black leading-[1.0] tracking-tight mb-5" style={{ fontSize:"clamp(1.6rem,3vw,2.6rem)", marginTop:"-1.2rem", color:"#FAF8F6" }}>
            {feature.title.split("\n").map((line,li) => (
              <span key={li} className="block">{li===1?<span style={{ color:feature.accent2 }}>{line}</span>:line}</span>
            ))}
          </h2>
          <p className="text-base leading-relaxed max-w-md mb-7" style={{ color:"#AC9F91" }}>{feature.body}</p>
          <div className="flex flex-wrap gap-2">
            {feature.tech.map(t=>(
              <span key={t} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border" style={{ color:feature.accent, borderColor:`${feature.accent}30`, background:`${feature.accent}08` }}>{t}</span>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="relative p-8 rounded-3xl" style={{ background:`${feature.accent}06`, border:`1px solid ${feature.accent}14`, minWidth:"300px" }}>
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none" style={{ opacity:0.03 }}>
              {Array.from({ length:28 }).map((_,i)=><div key={i} className="absolute left-0 right-0 h-px" style={{ top:`${i*3.7}%`, background:feature.accent }} />)}
            </div>
            <Viz accent={feature.accent} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastScaleRef = useRef(new Map<number, number>());

  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      const cards = containerRef.current?.querySelectorAll<HTMLElement>(".stack-card");
      if (cards?.length) {
        cards.forEach((card, i) => {
          const rect = card.getBoundingClientRect();
          const stickyTopVal = parseFloat(card.style.top) || 0;
          const isStuck = rect.top <= stickyTopVal + 1;

          if (isStuck) {
            let stackDepth = 0;
            cards.forEach((other, j) => {
              if (j <= i) return;
              const oRect = other.getBoundingClientRect();
              const oTop = parseFloat(other.style.top) || 0;
              if (oRect.top <= oTop + 1) stackDepth++;
            });
            const sc = Math.max(0.88, 1 - stackDepth * 0.04);
            const rounded = Math.round(sc * 1000) / 1000;
            const last = lastScaleRef.current.get(i) ?? 1;
            if (Math.abs(last - rounded) > 0.0005) {
              lastScaleRef.current.set(i, rounded);
              card.style.transform = `translate3d(0,0,0) scale(${rounded})`;
            }
          } else {
            const last = lastScaleRef.current.get(i) ?? 1;
            if (last !== 1) {
              lastScaleRef.current.set(i, 1);
              card.style.transform = "translate3d(0,0,0)";
            }
          }
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      alive = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="features" className="relative bg-[#0A0A0A] text-[#FAF8F6]">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Intro — centred with same max-width as cards */}
      <div className="max-w-5xl mx-auto text-center py-15 px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#A27B3D", animationName:"viz-pulse", animationDuration:"2s", animationIterationCount:"infinite" }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color:"#A27B3D" }}>7 Intelligent Features</span>
        </div>
        <h2 className="font-black leading-tight" style={{ fontSize:"clamp(2rem,5vw,4rem)" }}>
          Every Dimension of <br />
          <span className="italic" style={{ background:"linear-gradient(90deg,#A27B3D,#C9A96E,#A27B3D)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Student Intelligence.
          </span>
        </h2>
        {/* <p className="text-sm mt-4" style={{ color:"#98815D" }}>Scroll to explore ↓</p> */}
      </div>

      <div
        ref={containerRef}
        className="max-w-5xl mx-auto w-full px-4 md:px-8 pb-[10vh] flex flex-col items-center"
      >
        {FEATURES.map((feature, index) => (
          <FeatureCard key={feature.num} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}
