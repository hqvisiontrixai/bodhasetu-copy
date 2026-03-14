"use client";
import { memo } from "react";

const FEATURES = [
  { num:"01", title:"AI Classroom\nEngagement Detection",   tag:"Computer Vision",      accent:"#A27B3D", accent2:"#C9A96E", body:"Computer vision powered by OpenCV, MediaPipe & YOLO tracks every student in real time — detecting yawning, drowsiness, phone use, hand-raising, and writing activity.", tech:["OpenCV","MediaPipe","YOLO v8"], bgFrom:"#100e08" },
  { num:"02", title:"Automatic Quiz\nGeneration from PPTs", tag:"Academic Intelligence", accent:"#B76A32", accent2:"#D4834A", body:"Upload any lecture presentation and the AI instantly extracts key concepts and generates a structured 20-question quiz in under 60 seconds.", tech:["LLM","Document AI","NLP"], bgFrom:"#0f0b07" },
  { num:"03", title:"Learning Gap\nIntelligence",           tag:"Gap Detection",          accent:"#C64320", accent2:"#E05030", body:"AI cross-references quiz performance with class averages and surfaces exact knowledge gaps per student — triggered automatically, before the exam.", tech:["Analytics Engine","Percentile AI"], bgFrom:"#110807" },
  { num:"04", title:"Personalized\nStudy Roadmaps",         tag:"Adaptive Learning",      accent:"#2D5351", accent2:"#3D7270", body:"Weak topics get a personal To-Study list with PPT-derived explanations, curated examples, and a structured one-week completion timeline.", tech:["Personalization AI","LLM"], bgFrom:"#070f0e" },
  { num:"05", title:"Student Analytics\nDashboard",         tag:"Student Experience",     accent:"#A27B3D", accent2:"#C9A96E", body:"Rich personal dashboard — performance graphs, subject analytics, attendance, quiz history, learning velocity, and anonymous percentile comparisons.", tech:["Real-time Charts","Progress Tracking"], bgFrom:"#100e08" },
  { num:"06", title:"Teacher Insight\nDashboard",           tag:"Educator Intelligence",  accent:"#B76A32", accent2:"#D4834A", body:"Live engagement heatmaps, topic-level interaction data, flagged weak concepts, and full class learning trajectories — without manual data collection.", tech:["Heatmaps","AI Alerts"], bgFrom:"#0f0b07" },
  { num:"07", title:"AI Mental\nWellness Support",          tag:"Student Wellbeing",      accent:"#2D5351", accent2:"#3D7270", body:"An empathetic AI companion supporting students through academic pressure, exam anxiety, and motivation dips with personalised, contextual guidance.", tech:["Conversational AI","Sentiment Analysis"], bgFrom:"#070f0e" },
];

// ─── Inline SVG illustrations per feature ────────────────────────────────────

const EngagementIllustration = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
    <style>{`@keyframes ep{0%,100%{opacity:.4}50%{opacity:1}} @keyframes ea{0%,100%{r:5}50%{r:7}}`}</style>
    {Array.from({length:5},(_, row)=>Array.from({length:7},(_,col)=>{
      const i=row*7+col; const alert=[4,12,19,28].includes(i);
      return <circle key={i} cx={14+col*26} cy={12+row*22} r={alert?"6":"5"}
        fill={alert?"rgba(198,67,32,0.8)":`${accent}${Math.round((0.3+(Math.sin(i*1.7)+1)/4)*200).toString(16).padStart(2,"0")}`}
        style={{animation:`ep ${2+((Math.sin(i*1.7)+1)/2)}s ease-in-out infinite`,animationDelay:`${i*0.04}s`}} />
    }))}
  </svg>
);

const QuizIllustration = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
    <rect x="20" y="10" width="160" height="22" rx="6" fill={`${accent}18`} stroke={`${accent}40`} strokeWidth="1"/>
    <rect x="28" y="16" width="8" height="10" rx="2" fill={accent}/>
    <rect x="44" y="18" width="80" height="6" rx="3" fill={`${accent}60`}/>
    <rect x="132" y="17" width="36" height="8" rx="4" fill={`${accent}30`}/>
    {[38,68,98,128].map((y,i)=>(
      <g key={i}>
        <rect x="20" y={y} width="160" height="16" rx="5" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          style={{animation:`fadeIn .4s ease both`,animationDelay:`${i*0.15+0.3}s`,opacity:0}}/>
        <rect x="28" y={y+5} width="16" height="6" rx="2" fill={`${accent}50`}/>
        <rect x="52" y={y+5} width={60+i*10} height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
      </g>
    ))}
    <style>{`@keyframes fadeIn{to{opacity:1}}`}</style>
  </svg>
);

const GapIllustration = ({ accent }: { accent: string }) => {
  const topics:[string,number][] = [["Arrays",88],["Recursion",42],["Sorting",55],["DP",31]];
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
      {topics.map(([name,val],i)=>(
        <g key={name}>
          <text x="15" y={18+i*26} fill="#6b5842" fontSize="8" fontFamily="monospace">{name}</text>
          <rect x="62" y={10+i*26} width="110" height="10" rx="5" fill="rgba(255,255,255,0.05)"/>
          <rect x="62" y={10+i*26} width={val*1.1} height="10" rx="5"
            fill={val<50?"url(#gd-red)":"url(#gd-gold)"}
            style={{animation:"barGrow .8s ease both",animationDelay:`${i*0.1}s`,transformOrigin:"62px center",transform:"scaleX(0)"}}/>
          <text x={172+2} y={18+i*26} fill={val<50?"#C64320":accent} fontSize="8" fontFamily="monospace" fontWeight="bold">{val}%</text>
        </g>
      ))}
      <defs>
        <linearGradient id="gd-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A27B3D"/><stop offset="100%" stopColor="#C9A96E"/></linearGradient>
        <linearGradient id="gd-red"  x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#C64320"/><stop offset="100%" stopColor="#E05030"/></linearGradient>
      </defs>
      <style>{`@keyframes barGrow{to{transform:scaleX(1)}}`}</style>
    </svg>
  );
};

const RoadmapIllustration = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
    {[["Mon","Recursion",true,false],["Tue","Sorting",true,false],["Wed","Dynamic Prog.",false,true],["Thu","Data Str.",false,false]].map(([day,topic,done,cur],i)=>(
      <g key={i}>
        <rect x="12" y={8+i*27} width="176" height="20" rx="6"
          fill={cur?"rgba(45,83,81,0.15)":"rgba(255,255,255,0.02)"}
          stroke={cur?"rgba(45,83,81,0.4)":"rgba(255,255,255,0.05)"} strokeWidth="1"
          opacity={done&&!cur?0.5:1}/>
        <circle cx="26" cy={18+i*27} r="6"
          fill={done?"#A27B3D":"transparent"}
          stroke={done?"none":cur?"#2D5351":"rgba(255,255,255,0.1)"} strokeWidth="1.5"/>
        <text x="26" y={21+i*27} textAnchor="middle" fill={done?"#0A0A0A":"#6b5842"} fontSize="6" fontWeight="bold">{done?"✓":i+1}</text>
        <text x="38" y={16+i*27} fill={cur?"#FAF8F6":"#98815D"} fontSize="8" fontWeight={cur?"600":"400"}>{topic as string}</text>
        <text x="38" y={24+i*27} fill="#4a3b2a" fontSize="6" fontFamily="monospace">{day as string} · AI set</text>
        {cur&&<rect x="152" y={13+i*27} width="28" height="10" rx="5" fill={`${accent}25`}/>}
        {cur&&<text x="166" y={20+i*27} textAnchor="middle" fill={accent} fontSize="6" fontWeight="bold">Today</text>}
      </g>
    ))}
  </svg>
);

const DashboardIllustration = ({ accent }: { accent: string }) => {
  const weeks=[62,74,68,81,77,89,84];
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
      <text x="15" y="18" fill="#FAF8F6" fontSize="10" fontWeight="600">Arjun Mehta</text>
      <text x="15" y="28" fill="#6b5842" fontSize="7" fontFamily="monospace">Grade 11 · CS</text>
      <text x="165" y="18" fill={accent} fontSize="18" fontWeight="900" textAnchor="end">84%</text>
      <text x="165" y="28" fill="#6b5842" fontSize="7" textAnchor="end" fontFamily="monospace">Overall</text>
      {weeks.map((v,i)=>(
        <rect key={i} x={15+i*24} y={95-(v*0.55)} width="18" height={v*0.55} rx="3"
          fill={i===6?accent:`${accent}50`}
          style={{animation:"barUp .6s ease both",animationDelay:`${i*0.07}s`,transformOrigin:`${24+i*24}px 95px`,transform:"scaleY(0)"}}/>
      ))}
      {["W1","W2","W3","W4","W5","W6","W7"].map((w,i)=>(
        <text key={w} x={24+i*24} y="108" fill="#4a3b2a" fontSize="6" textAnchor="middle" fontFamily="monospace">{w}</text>
      ))}
      <style>{`@keyframes barUp{to{transform:scaleY(1)}}`}</style>
    </svg>
  );
};

const TeacherIllustration = ({ accent }: { accent: string }) => {
  const slides=Array.from({length:28},(_,i)=>({n:i+1,e:(Math.sin(i)+1)/2,flag:[10,14,22].includes(i+1)}));
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
      <text x="10" y="12" fill="#6b5842" fontSize="7" fontFamily="monospace" letterSpacing="1">ENGAGEMENT HEATMAP</text>
      {slides.map((s,i)=>{
        const col=i%7, row=Math.floor(i/7);
        return <rect key={s.n} x={10+col*26} y={18+row*22} width="20" height="16" rx="3"
          fill={s.flag?"rgba(198,67,32,0.6)":`rgba(${Math.round(45+s.e*117)},${Math.round(51+s.e*72)},30,${0.2+s.e*0.7})`}
          stroke={s.flag?"#C6432040":"transparent"} strokeWidth="1"
          style={s.flag?{animation:"ep 1.4s ease-in-out infinite"}:{}}/>;
      })}
      <style>{`@keyframes ep{0%,100%{opacity:.7}50%{opacity:1}}`}</style>
    </svg>
  );
};

const WellnessIllustration = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 200 120" fill="none" className="w-full h-full">
    {[
      {from:"s",text:"Stressed about exams...",y:12},
      {from:"ai",text:"Which subject feels hardest?",y:38},
      {from:"s",text:"Data Structures mostly.",y:64},
      {from:"ai",text:"You already get BFS. Try DFS next.",y:90},
    ].map((m,i)=>(
      <g key={i} style={{animation:"fadeIn .4s ease both",animationDelay:`${i*0.2}s`,opacity:0}}>
        <rect
          x={m.from==="s"?70:10} y={m.y} width="120" height="20" rx="8"
          fill={m.from==="ai"?`${accent}20`:"rgba(255,255,255,0.05)"}
          stroke={m.from==="ai"?`${accent}30`:"rgba(255,255,255,0.05)"} strokeWidth="1"
        />
        <text x={m.from==="s"?80:20} y={m.y+13} fill={m.from==="ai"?"#C9A96E":"#AC9F91"} fontSize="6.5">{m.text}</text>
      </g>
    ))}
    <style>{`@keyframes fadeIn{to{opacity:1}}`}</style>
  </svg>
);

const ILLUSTRATIONS = [
  EngagementIllustration, QuizIllustration, GapIllustration,
  RoadmapIllustration, DashboardIllustration, TeacherIllustration, WellnessIllustration
];

// ─── Bento layout config ──────────────────────────────────────────────────────
// 7 cards across a 6-column grid
// Row 1: [0]=col-span-2 tall, [1]=col-span-2 short, [2]=col-span-2 short
// Row 2: [3]=col-span-2 short, [4]=col-span-2 short, [5]=col-span-2 tall (mirrors row1)
// Row 3: [6]=col-span-6 wide banner

const LAYOUT = [
  // index, colSpan, rowSpan, illustration position
  { colSpan:"md:col-span-2", rowSpan:"md:row-span-2", illPos:"bottom" },  // 0 — tall
  { colSpan:"md:col-span-2", rowSpan:"md:row-span-1", illPos:"right"  },  // 1 — short
  { colSpan:"md:col-span-2", rowSpan:"md:row-span-1", illPos:"right"  },  // 2 — short
  { colSpan:"md:col-span-2", rowSpan:"md:row-span-1", illPos:"right"  },  // 3 — short
  { colSpan:"md:col-span-2", rowSpan:"md:row-span-1", illPos:"right"  },  // 4 — short
  { colSpan:"md:col-span-2", rowSpan:"md:row-span-2", illPos:"bottom" },  // 5 — tall
  { colSpan:"md:col-span-4", rowSpan:"md:row-span-1", illPos:"right"  },  // 6 — wide
];

const GLOBAL_CSS = `
  @keyframes viz-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }

  .bento-card {
    position: relative;
    overflow: hidden;
    // border-radius: 20px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .bento-card:hover {
    box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
  }
  .bento-card .bento-ill {
    transition: transform 0.5s ease;
  }
  .bento-card:hover .bento-ill {
    transform: scale(1.04);
  }
`;

function BentoCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Ill = ILLUSTRATIONS[index];
  const layout = LAYOUT[index];
  const isTall = layout.rowSpan === "md:row-span-2";
  const isWide = layout.colSpan === "md:col-span-4";

  return (
    <div
      className={`bento-card ${layout.colSpan} ${layout.rowSpan} flex ${isTall ? "flex-col justify-between" : isWide ? "flex-row items-center" : "flex-col justify-between"} p-7`}
      style={{
        background: `linear-gradient(135deg, ${feature.bgFrom} 0%, #0c0c0c 100%)`,
        border: `1px solid ${feature.accent}18`,
        minHeight: isTall ? "320px" : "150px",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:`radial-gradient(ellipse 70% 60% at ${isTall?"80% 20%":"80% 50%"},${feature.accent}14 0%,transparent 70%)` }} />

      {/* Text content */}
      <div className={`relative z-10 ${isWide ? "flex-1 max-w-sm" : ""}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-px h-3 rounded-full flex-shrink-0" style={{ background: feature.accent }} />
          {/* <span className="text-[9px] font-semibold tracking-[0.15em] uppercase" style={{ color: feature.accent }}>
            {feature.tag}
          </span> */}
        </div>

        <h3
          className="font-black leading-[1.05] tracking-tight mb-3"
          style={{ fontSize: isTall ? "clamp(1.4rem,2.5vw,2rem)" : "clamp(1.1rem,2vw,1.4rem)", color:"#FAF8F6" }}
        >
          {feature.title.split("\n").map((line, li) => (
            <span key={li} className="block">
              {li === 1 ? <span style={{ color: feature.accent2 }}>{line}</span> : line}
            </span>
          ))}
        </h3>

        <p className="text-[12px] leading-relaxed" style={{ color:"#6b5842", maxWidth: isWide ? "280px" : "100%" }}>
          {feature.body}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {feature.tech.map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
              style={{ color:feature.accent, borderColor:`${feature.accent}25`, background:`${feature.accent}08` }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Illustration */}
      <div
        className={`bento-ill relative z-10 ${
          isTall ? "mt-6 h-32" :
          isWide ? "w-56 h-28 ml-8 flex-shrink-0" :
          "mt-4 h-24"
        }`}
      >
        <Ill accent={feature.accent} />
      </div>

      {/* Number watermark */}
      <div
        className="absolute bottom-4 right-5 font-black leading-none select-none pointer-events-none"
        style={{
          fontSize: isTall ? "7rem" : "4.5rem",
          color: `${feature.accent}08`,
          WebkitTextStroke: `1px ${feature.accent}12`,
        }}
      >
        {feature.num}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-[#0A0A0A] text-[#FAF8F6] py-24 px-4 md:px-10">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-14">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#A27B3D", animationName:"viz-pulse", animationDuration:"2s", animationIterationCount:"infinite" }} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color:"#A27B3D" }}>7 Intelligent Features</span>
        </div>
        <h2
          className="font-black leading-[1.0] tracking-tight"
          style={{ fontSize:"clamp(2.2rem,5vw,4rem)", maxWidth:"600px" }}
        >
          Build Systems That<br />
          <span className="italic" style={{ background:"linear-gradient(90deg,#A27B3D,#C9A96E,#B76A32)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Think, Not Just React.
          </span>
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
  {FEATURES.map((feature, index) => {
    const Ill = ILLUSTRATIONS[index];

    return (
      <div
        key={index}
        className="bento-card relative overflow-hidden flex flex-col justify-between p-7 h-100"
        style={{
        //   background: `linear-gradient(135deg, ${feature.bgFrom} 0%, #0c0c0c 100%)`,
          border: `1px solid ${feature.accent}18`,
          minHeight: "280px"
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none bg-white/5"
        //   style={{
        //     background: `radial-gradient(ellipse 70% 60% at 80% 50%, ${feature.accent}14 0%, transparent 70%)`
        //     background: `black`
        //   }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* <div className="flex items-center gap-2 mb-3">
            <div
              className="w-px h-3 rounded-full"
              style={{ background: feature.accent }}
            />
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: feature.accent }}
            >
              {feature.tag}
            </span>
          </div> */}

          <h3 className="font-black leading-[1.05] tracking-tight mb-3 text-2xl">
            {feature.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span style={{ color: feature.accent2 }}>{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h3>

          <p className="text-[12px] text-[#6b5842] leading-relaxed mb-4 mt-3">
            {feature.body}
          </p>

          {/* Tech tags */}
          {/* <div className="flex flex-wrap gap-2">
            {feature.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
                style={{
                  color: feature.accent,
                  borderColor: `${feature.accent}25`,
                  background: `${feature.accent}08`
                }}
              >
                {t}
              </span>
            ))}
          </div> */}
        </div>

        {/* Illustration */}
        <div className="relative z-10 h-34">
          <Ill accent={feature.accent} />
        </div>

        {/* Watermark number */}
        {/* <div
          className="absolute bottom-4 right-5 font-black leading-none select-none pointer-events-none"
          style={{
            fontSize: "4.5rem",
            color: `${feature.accent}07`,
            WebkitTextStroke: `1px ${feature.accent}10`
          }}
        >
          {feature.num}
        </div> */}
      </div>
    );
  })}
</div>

    </section>
  );
}
