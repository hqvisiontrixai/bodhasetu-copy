"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@visiontrixin.ai",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16 px-6">
      {/* Subtle glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#A27B3D]/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#A27B3D] to-[#B76A32]" />
                <div className="absolute inset-[2px] rounded-md bg-[#0A0A0A] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="#A27B3D" strokeWidth="1.5" fill="none" />
                    <circle cx="8" cy="8" r="2" fill="#B76A32" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold font-display text-cream">Bodha Setu</div>
                <div className="text-[10px] text-[#98815D] tracking-widest uppercase">by visiontriX AI</div>
              </div>
            </div>
            <p className="text-sm text-[#98815D] leading-relaxed max-w-xs">
              AI-powered student monitoring and academic intelligence platform
              designed for educational institutions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#AC9F91] mb-4">Platform</h4>
            <div className="flex flex-col gap-3">
              {["Features", "Technology", "Analytics", "Early Access"].map((link) => (
                <Link
                  key={link}
                  href={link === "Early Access" ? "/signup" : `#${link.toLowerCase()}`}
                  className="text-sm text-[#98815D] hover:text-cream transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#AC9F91] mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <div className="text-sm text-[#98815D]">
                📧{" "}
                <a href="mailto:hello@visiontrixin.ai" className="hover:text-cream transition-colors">
                  hello@visiontrixin.ai
                </a>
              </div>
              <div className="text-sm text-[#98815D]">📞 +91 (placeholder)</div>
              <div className="flex items-center gap-3 mt-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[#98815D] hover:text-[#A27B3D] hover:border-[#A27B3D]/30 border border-white/5 transition-all duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#98815D]">
            © 2026 visiontriX AI. All rights reserved. Bodha Setu™
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold text-[10px] text-[#C9A96E] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A27B3D] animate-pulse" />
            Early Access Open
          </div>
        </div>
      </div>
    </footer>
  );
}
