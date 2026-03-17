"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import Form from "@/components/Form";

type Role = "student" | "teacher" | "admin";

type FormState = {
  name: string;
  email: string;
  institution: string;
  role: Role | "";
  referral_source: string;
};

export default function SignupPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    institution: "",
    role: "",
    referral_source: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.institution ||
      !form.role ||
      !form.referral_source
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <AnimatedBackground />

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-[#AC9F91] hover:text-cream transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13 8H3M7 4L3 8l4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Back to Glint IQ
      </Link>

      <div className="relative z-10 w-full max-w-7xl">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full bg-[#A27B3D]/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full glass-gold flex items-center justify-center text-4xl border border-[#A27B3D]/30">
                  ✓
                </div>
              </div>

              <h2 className="font-display font-black text-4xl text-cream mb-4">
                You're In!
              </h2>

              <p className="text-[#AC9F91] text-lg mb-2">
                Welcome to the Glint IQ early access waitlist.
              </p>

              <p className="text-sm text-[#98815D] mb-10">
                We'll reach out to{" "}
                <span className="text-[#C9A96E]">{form.email}</span> soon.
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#A27B3D] to-[#B76A32] text-[#0A0A0A] font-semibold text-sm"
              >
                Back to Home
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center text-6xl font-medium text-[#C9A96E] uppercase mb-6">
                   <div className="ea-panel-brand">
            <span className="ea-brand-dot" />
            Early Access
          </div>
                </div>

                <h1 className="font-display font-black text-4xl text-cream mb-3">
                  Join Glint IQ
                </h1>

                <p className="text-[#AC9F91] text-sm leading-relaxed">
                  Be among the first institutions to experience AI-powered
                  classroom intelligence.
                </p>
              </div>

              <Form
                // form={form}
                // loading={loading}
                // error={error}
                // onChange={handleChange}
                // onSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}