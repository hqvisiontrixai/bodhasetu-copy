"use client";
import React, { useState } from "react";
import Link from "next/link";
import SlideInButton from "./SlideInButton";
import dynamic from "next/dynamic";
const BridgeCanvas = dynamic(() => import("./BridgeCanvas"), { ssr: false });

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
export default function HeroSection() {
  const [inputValue, setInputValue] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);




  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ------------------------------------------------------------------ */}
      {/* Bridge canvas wrapper                                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0 z-0 opacity-30 md:opacity-100">
        {/* Vignette to blend left text area (stronger on desktop) */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden md:block"
          style={{
            background: "linear-gradient(90deg, #0A0A0A 32%, #0A0A0Acc 50%, #0A0A0A66 62%, transparent 72%)",
          }}
        />
        {/* Subtle vignette for mobile */}
        <div className="absolute inset-0 z-10 pointer-events-none block md:hidden"
          style={{
            background: "linear-gradient(90deg, #0A0A0A 20%, #0A0A0A99 50%, #0A0A0A33 80%, transparent 100%)",
          }}
        />
        {/* Top + bottom fade */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, #0A0A0A 0%, transparent 12%, transparent 80%, #0A0A0A 100%)",
          }}
        />
        <BridgeCanvas />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* LEFT — Content                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 md:px-10 pt-24 pb-16">
        <div className="max-w-xl">

          {/* Badge */}
          <div className="flex items-center gap-2 mb-8 animate-fade-in-up [animation-delay:100ms] [animation-fill-mode:forwards]">
            <div className="inline-flex items-center text-6xl font-bold text-[#C9A96E] uppercase">
              <div className="ea-panel-brand">
                <span className="ea-brand-dot" />
                visiontriX AI · Early Access
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-black leading-[0.92] tracking-tight mb-6 animate-fade-in-up [animation-delay:200ms] [animation-fill-mode:forwards]"
            style={{ fontSize: "clamp(2.5rem, 8vw, 4.8rem)" }}
          >
            <span className="text-cream block">Glint IQ</span>
            <span className="block text-[#B76A32] font-light text-[0.6em] mt-3 tracking-normal leading-snug">
              Insights. <span className="italic">Redefined.</span>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-white/90 text-base md:text-lg leading-relaxed mb-10 max-w-xl animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:forwards]">
            <span className="italic font-bold">Bridging </span>  classroom signals to actionable learning insights through AI‑powered computer vision.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-4 mb-14 animate-fade-in-up [animation-delay:500ms] [animation-fill-mode:forwards]">
            <SlideInButton text="Sign up for Early Access" href="/signup" />
          </div>
          
          <div className="animate-fade-in-up [animation-delay:700ms] [animation-fill-mode:forwards]">
          </div>


        </div>
      </div>

    </section>
  );
}
