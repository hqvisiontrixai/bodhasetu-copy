"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";

type Role = "student" | "teacher" | "admin";

const ROLES: { value: Role; label: string; icon: string }[] = [
  { value: "student", label: "Student", icon: "📚" },
  { value: "teacher", label: "Teacher", icon: "👨‍🏫" },
  { value: "admin", label: "Admin / Institution", icon: "🏛️" },
];

type FormState = {
  name: string;
  email: string;
  institution: string;
  role: Role | "";
};

export default function SignupPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    institution: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.institution || !form.role) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

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
          <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Back to Bodha Setu
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full bg-[#A27B3D]/20 animate-ping" />
                <div className="relative w-24 h-24 rounded-full glass-gold flex items-center justify-center text-4xl border border-[#A27B3D]/30">
                  ✓
                </div>
              </div>
              <h2 className="font-display font-black text-4xl text-cream mb-4">
                You&apos;re In!
              </h2>
              <p className="text-[#AC9F91] text-lg mb-2">
                Welcome to the Bodha Setu early access waitlist.
              </p>
              <p className="text-sm text-[#98815D] mb-10">
                We&apos;ll reach out to{" "}
                <span className="text-[#C9A96E]">{form.email}</span> with
                onboarding details as we roll out.
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
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-xs font-medium text-[#C9A96E] tracking-widest uppercase mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A27B3D] animate-pulse" />
                  Early Access
                </div>
                <h1 className="font-display font-black text-4xl text-cream mb-3">
                  Join Bodha Setu
                </h1>
                <p className="text-[#AC9F91] text-sm leading-relaxed">
                  Be among the first institutions to experience AI-powered
                  classroom intelligence.
                </p>
              </div>

              {/* Form card */}
              <div className="relative">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#A27B3D]/30 via-transparent to-[#2D5351]/20 blur-[1px]" />
                <form
                  onSubmit={handleSubmit}
                  className="relative glass rounded-2xl p-8 flex flex-col gap-5"
                  id="signup-form"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#AC9F91] mb-2">
                      Full Name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Dr. Ananya Sharma"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-cream placeholder-[#98815D]/50 outline-none focus:border-[#A27B3D]/60 focus:bg-[#A27B3D]/[0.03] transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#AC9F91] mb-2">
                      Email Address
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="ananya@university.edu"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-cream placeholder-[#98815D]/50 outline-none focus:border-[#A27B3D]/60 focus:bg-[#A27B3D]/[0.03] transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Institution */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#AC9F91] mb-2">
                      Institution / Organization
                    </label>
                    <input
                      id="institution-input"
                      type="text"
                      value={form.institution}
                      onChange={(e) => handleChange("institution", e.target.value)}
                      placeholder="IIT Delhi, DPS, Sunrise Academy..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-cream placeholder-[#98815D]/50 outline-none focus:border-[#A27B3D]/60 focus:bg-[#A27B3D]/[0.03] transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#AC9F91] mb-3">
                      I&apos;m a...
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          id={`role-${role.value}`}
                          onClick={() => handleChange("role", role.value)}
                          className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                            form.role === role.value
                              ? "border-[#A27B3D]/60 bg-[#A27B3D]/10 text-cream"
                              : "border-white/10 text-[#AC9F91] hover:border-white/20 hover:text-cream"
                          }`}
                        >
                          <span className="text-xl">{role.icon}</span>
                          <span className="text-xs">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-[#C64320] bg-[#C64320]/10 border border-[#C64320]/20 rounded-xl px-4 py-3"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    type="submit"
                    id="submit-button"
                    disabled={loading}
                    className="relative w-full py-4 rounded-xl font-semibold text-[#0A0A0A] text-sm overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#A27B3D] to-[#B76A32] group-hover:from-[#B76A32] group-hover:to-[#A27B3D] transition-all duration-300" />
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full"
                          />
                          Joining Waitlist...
                        </>
                      ) : (
                        <>
                          Join the Early Access
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>

                  <p className="text-center text-[10px] text-[#98815D]">
                    By joining, you agree to receive product updates from visiontriX AI.
                    No spam, ever.
                  </p>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
