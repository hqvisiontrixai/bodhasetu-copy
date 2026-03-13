"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "Analytics", href: "#analytics" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 glass border-b border-white/5"
          : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#A27B3D] to-[#B76A32] opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[2px] rounded-md bg-[#0A0A0A] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z"
                  stroke="#A27B3D"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="8" cy="8" r="2" fill="#B76A32" />
              </svg>
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold font-display text-cream tracking-tight">
              Bodha Setu
            </span>
            <span className="block text-[10px] text-[#98815D] tracking-widest uppercase font-medium leading-none mt-0.5">
              by visiontriX AI
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-[#AC9F91] hover:text-cream transition-colors duration-200 font-medium tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/signup"
            className="relative px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] bg-gradient-to-r from-[#A27B3D] to-[#B76A32] rounded-full hover:from-[#B76A32] hover:to-[#A27B3D] transition-all duration-300 group overflow-hidden"
          >
            <span className="relative z-10">Get Early Access</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-cream p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-[#AC9F91] transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1" : ""}`} />
          <div className={`w-5 h-0.5 bg-[#AC9F91] mt-1.5 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-[#AC9F91] mt-1.5 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5 mt-3"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#AC9F91] hover:text-cream transition-colors py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/signup"
                className="text-sm font-semibold text-center py-2.5 rounded-full bg-gradient-to-r from-[#A27B3D] to-[#B76A32] text-[#0A0A0A]"
                onClick={() => setMenuOpen(false)}
              >
                Get Early Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
