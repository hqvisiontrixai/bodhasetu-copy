"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client (lazy) ───────────────────────────────────────────────────
// Created on demand so a missing env var doesn't crash the page at load time.
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("placeholder")) {
    throw new Error("Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local");
  }
  return createClient(url, key);
}
type Role = "student" | "teacher" | "admin";
const ROLES: { value: Role; label: string; icon: string }[] = [
  { value: "student", label: "Student", icon: "📚" },
  { value: "teacher", label: "Teacher", icon: "👨‍🏫" },
  { value: "admin", label: "Admin / Institution", icon: "🏛️" },
];

// type Props = {
//   form: FormState;
//   loading: boolean;
//   error: string;
//   onChange: (field: keyof FormState, value: string) => void;
//   onSubmit: (e: React.FormEvent) => void;
// };

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  full_name: string;
  email: string;
  institution: string;
  referral_source: string;
  role: Role | "";
}

const REFERRAL_OPTIONS = [
  "LinkedIn",
  "Instagram",
  "Twitter / X",
  "Word of mouth",
  "Google Search",
  "YouTube",
  "College / University event",
  "Other",
];

type FormState = {
  name: string;
  email: string;
  institution: string;
  role: Role | "";
  referral_source: string;
};



// ─── Animated counter for queue number ───────────────────────────────────
function QueueCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(start);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <span>{count.toLocaleString()}</span>;
}

// ─── Main component ───────────────────────────────────────────────────────
export default function Form() {
  const [form, setForm] = useState<FormData>({
    full_name: "", email: "", institution: "", referral_source: "", role: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [queueNum, setQueueNum] = useState(0);
  const [focused, setFocused] = useState<string | null>(null);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [Error, setError] = useState("");


  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.full_name.trim())       e.full_name       = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.institution.trim())     e.institution     = "Required";
    if (!form.referral_source)        e.referral_source = "Please select one";
    // if (!form.sector)                 e.sector          = "Please select one";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("early_access_signups")
        .insert([{
          full_name:       form.full_name.trim(),
          email:           form.email.trim().toLowerCase(),
          institution:    form.institution.trim(),
          referral_source: form.referral_source,
          role:           form.role,
          created_at:      new Date().toISOString(),
        }])
        .select("id")
        .single();
        console.log("SUPABASE RESPONSE:", { data, error });


      if (error) throw error;

      // Get queue position
      const { count } = await supabase
        .from("early_access_signups")
        .select("*", { count: "exact", head: true });

      setQueueNum(count ?? 1);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Supabase insert error:", err);
      // Handle duplicate email gracefully
      if (err?.code === "23505") {
        setErrors({ email: "This email is already registered!" });
      } else {
        setErrors({ email: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  const set = (key: keyof FormData, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  // ─── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="ea-root">
        <style>{STYLES}</style>
        <div className="ea-success">
          <div className="ea-success-orb">
            <svg viewBox="0 0 48 48" fill="none" className="ea-checkmark">
              <circle cx="24" cy="24" r="22" stroke="#A27B3D" strokeWidth="2" strokeDasharray="138" strokeDashoffset="138" className="ea-circle-draw" />
              <path d="M14 24l7 7 13-14" stroke="#C9A96E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset="30" className="ea-check-draw" />
            </svg>
          </div>

          <div className="ea-panel-brand">
            <span className="ea-brand-dot" />
            Early Access Confirmed
          </div>

          <h2 className="ea-success-title">
            You're in,<br />
            <span className="text-[#B76A32] italic font-semibold">{form.full_name.split(" ")[0]}.</span>
          </h2>

          <p className="ea-success-body">
            Congratulations on submitting the form. You are now in the queue for early access to Bodha Setu.
          </p>

          <div className="ea-queue-card">
            <div className="ea-queue-label">Your position in queue</div>
            <div className="ea-queue-number">
              #<QueueCounter target={queueNum+55} />
            </div>
            <div className="ea-queue-sub">We'll reach out to you shortly at <strong>{form.email}</strong></div>
          </div>

          
        </div>
      </div>
    );
  }

  // ─── Form state ─────────────────────────────────────────────────────────────
  return (
    <div className="ea-root">
      <style>{STYLES}</style>

      <div className="ea-card">
        {/* Left panel */}
        <div className="ea-panel-left">
          {/* <div className="ea-panel-glow" /> */}
          {/* <div className="ea-badge">Early Access</div> */}

          <h1 className="ea-headline">
            Claim your<br />
            <span className="italic text-[#B76A32]" style={{ WebkitTextStroke:"0.5px #B76A3220" }}>early seat.</span>
          </h1>

          <p className="ea-subline">
            Bodha Setu is launching soon. Join the waitlist and be among the first institutions to experience AI-powered classroom intelligence.
          </p>

          <div className="ea-panel-brand">
            <span className="ea-brand-dot" />
            visiontriX AI · Bodha Setu
          </div>
        </div>

        {/* Right panel — form */}
        <form className="ea-panel-right" onSubmit={handleSubmit} noValidate>
          <div className="ea-form-header">
            <span className="ea-form-step">01 / 01</span>
            <h2 className="ea-form-title">Tell us about yourself</h2>
          </div>

          {/* Full name */}
          <div className={`ea-field ${focused === "full_name" ? "ea-field--focused" : ""} ${errors.full_name ? "ea-field--error" : form.full_name ? "ea-field--filled" : ""}`}>
            <label className="ea-label">Full Name</label>
            <input
              className="ea-input"
              type="text"
              placeholder="Arjun Mehta"
              value={form.full_name}
              onChange={e => set("full_name", e.target.value)}
              onFocus={() => setFocused("full_name")}
              onBlur={() => setFocused(null)}
              autoComplete="name"
            />
            {errors.full_name && <span className="ea-error">{errors.full_name}</span>}
          </div>

          {/* Email */}
          <div className={`ea-field ${focused === "email" ? "ea-field--focused" : ""} ${errors.email ? "ea-field--error" : form.email ? "ea-field--filled" : ""}`}>
            <label className="ea-label">Email Address</label>
            <input
              className="ea-input"
              type="email"
              placeholder="arjun@institute.edu"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              autoComplete="email"
            />
            {errors.email && <span className="ea-error">{errors.email}</span>}
          </div>

          {/* Contact */}
          <div className={`ea-field ${focused === "institution" ? "ea-field--focused" : ""} ${errors.institution ? "ea-field--error" : form.institution ? "ea-field--filled" : ""}`}>
            <label className="ea-label">Institution / Organization</label>
            <input
              className="ea-input"
              type="text"
              placeholder="IIT Delhi, DPS, Sunrise Academy..."
              value={form.institution}
              onChange={e => set("institution", e.target.value)}
              onFocus={() => setFocused("institution")}
              onBlur={() => setFocused(null)}
              autoComplete="organization"
            />
            {errors.institution && <span className="ea-error">{errors.institution}</span>}
          </div>

          {/* Referral source */}
          <div className={`ea-field ${errors.referral_source ? "ea-field--error" : form.referral_source ? "ea-field--filled" : ""}`}>
            <label className="ea-label">How did you hear about us?</label>
            <div className="ea-select-wrap">
              <button type="button" className="ea-select-btn" onClick={() => { setReferralOpen(o => !o); setSectorOpen(false); }}>
                <span className={form.referral_source ? "ea-select-value" : "ea-select-placeholder"}>
                  {form.referral_source || "Select a source"}
                </span>
                <svg className={`ea-select-caret ${referralOpen ? "ea-select-caret--open" : ""}`} viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {referralOpen && (
                <div className="ea-dropdown">
                  {REFERRAL_OPTIONS.map(opt => (
                    <button key={opt} type="button" className={`ea-dropdown-item ${form.referral_source === opt ? "ea-dropdown-item--active" : ""}`}
                      onClick={() => { set("referral_source", opt); setReferralOpen(false); }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.referral_source && <span className="ea-error">{errors.referral_source}</span>}
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
                          onClick={() => set("role", role.value)}
                          className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                            form.role === role.value
                              ? "border-[#A27B3D]/60 bg-[#A27B3D]/10 text-cream"
                              : "border-white/10 text-[#AC9F91] hover:border-white/20 hover:text-cream"
                          }`}
                        >
                          {/* <span className="text-xl">{role.icon}</span> */}
                          <span className="text-xs">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

          {/* Submit */}
          <button type="submit" className={`ea-submit ${loading ? "ea-submit--loading" : ""}`} disabled={loading}>
            {loading ? (
              <span className="ea-spinner" />
            ) : (
              <>
              
                <span>Join the Early Access</span>
                <svg viewBox="0 0 20 20" fill="none" className="ea-submit-arrow">
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>

          <p className="ea-disclaimer">
            No spam. No credit card. We'll only reach out when your slot opens.
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

  .ea-root {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    background: #0A0A0A;
    font-family: 'Outfit', system-ui, sans-serif;
  }

  /* ── Card shell ── */
  .ea-card {
    width: 100%;
    max-width: 960px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 28px;
    overflow: hidden;
    border: 1px solid rgba(162,123,61,0.18);
    box-shadow: 0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
    animation: ea-fade-up 0.6s ease both;
  }
  @media (max-width: 720px) {
    .ea-card { grid-template-columns: 1fr; }
  }
  @keyframes ea-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Left panel ── */
  .ea-panel-left {
    position: relative;
    background: linear-gradient(155deg, #100e08 0%, #0d0b07 60%, #0a0a0a 100%);
    padding: 52px 44px;
    display: flex;
    flex-direction: column;
    gap: 0;
    border-right: 1px solid rgba(162,123,61,0.12);
    overflow: hidden;
  }
  .ea-panel-glow {
    position: absolute;
    top: -80px; left: -80px;
    width: 380px; height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(162,123,61,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .ea-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #C9A96E;
    border: 1px solid rgba(162,123,61,0.3);
    border-radius: 100px;
    padding: 5px 12px;
    width: fit-content;
    margin-bottom: 32px;
  }
  .ea-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #A27B3D;
    animation: ea-badge-pulse 2s ease-in-out infinite;
  }
  @keyframes ea-badge-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }

  .ea-headline {
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: #FAF8F6;
    margin-bottom: 18px;
  }
  .ea-gold-text {
    background: linear-gradient(90deg, #A27B3D, #C9A96E, #B76A32);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .ea-subline {
    font-size: 13px;
    line-height: 1.7;
    color: #98815D;
    margin-bottom: 36px;
    max-width: 280px;
  }

  .ea-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: auto; }
  .ea-feature-row { display: flex; align-items: center; gap: 10px; }
  .ea-feature-icon { font-size: 15px; width: 28px; text-align: center; flex-shrink: 0; }
  .ea-feature-text { font-size: 12px; color: #AC9F91; letter-spacing: 0.01em; }

  .ea-panel-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #4a3b2a;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: left;
  }
  .ea-brand-dot { width: 5px; height: 5px; border-radius: 50%; background: #A27B3D; opacity: 0.5; }

  /* ── Right panel (form) ── */
  .ea-panel-right {
    background: #0f0d0b;
    padding: 52px 44px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  @media (max-width: 720px) {
    .ea-panel-left, .ea-panel-right { padding: 36px 28px; }
  }

  .ea-form-header { margin-bottom: 8px; }
  .ea-form-step {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #4a3b2a;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 6px;
  }
  .ea-form-title { font-size: 20px; font-weight: 700; color: #FAF8F6; letter-spacing: -0.01em; }

  /* ── Field ── */
  .ea-field { display: flex; flex-direction: column; gap: 6px; position: relative; }
  .ea-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b5842;
    transition: color 0.2s;
  }
  .ea-field--focused .ea-label { color: #C9A96E; }
  .ea-field--filled .ea-label  { color: #A27B3D; }
  .ea-field--error .ea-label   { color: #C64320; }

  .ea-input {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
    color: #FAF8F6;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .ea-input::placeholder { color: #3a2e22; }
  .ea-input:focus {
    border-color: rgba(162,123,61,0.5);
    background: rgba(162,123,61,0.04);
    box-shadow: 0 0 0 3px rgba(162,123,61,0.08);
  }
  .ea-field--error .ea-input { border-color: rgba(198,67,32,0.5); }
  .ea-field--filled .ea-input { border-color: rgba(162,123,61,0.2); }

  .ea-error {
    font-size: 11px;
    color: #C64320;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.03em;
  }

  /* ── Custom select ── */
  .ea-select-wrap { position: relative; }
  .ea-select-btn {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
    color: #FAF8F6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color 0.2s, background 0.2s;
    text-align: left;
  }
  .ea-select-btn:hover { border-color: rgba(162,123,61,0.3); background: rgba(162,123,61,0.03); }
  .ea-field--filled .ea-select-btn { border-color: rgba(162,123,61,0.2); }
  .ea-field--error .ea-select-btn  { border-color: rgba(198,67,32,0.5); }
  .ea-select-placeholder { color: #3a2e22; }
  .ea-select-value { color: #FAF8F6; }
  .ea-select-caret { width: 14px; height: 14px; color: #6b5842; transition: transform 0.2s; flex-shrink: 0; }
  .ea-select-caret--open { transform: rotate(180deg); }

  .ea-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0; right: 0;
    background: #1a1410;
    border: 1px solid rgba(162,123,61,0.2);
    border-radius: 12px;
    overflow: hidden;
    z-index: 50;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    animation: ea-dropdown-in 0.15s ease both;
  }
  @keyframes ea-dropdown-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ea-dropdown-item {
    width: 100%;
    padding: 10px 16px;
    font-size: 13px;
    font-family: 'Outfit', sans-serif;
    color: #AC9F91;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .ea-dropdown-item:hover { background: rgba(162,123,61,0.08); color: #FAF8F6; }
  .ea-dropdown-item--active { color: #C9A96E; background: rgba(162,123,61,0.06); }

 
  .ea-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .ea-pill {
    padding: 7px 14px;
    font-size: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    color: #6b5842;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 100px;
    background: rgba(255,255,255,0.02);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .ea-pill:hover { border-color: rgba(162,123,61,0.3); color: #AC9F91; background: rgba(162,123,61,0.04); }
  .ea-pill--active {
    border-color: rgba(162,123,61,0.6);
    background: rgba(162,123,61,0.1);
    color: #C9A96E;
    box-shadow: 0 0 0 3px rgba(162,123,61,0.08);
  }

  /* ── Submit button ── */
  .ea-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 24px;
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #0A0A0A;
    background: #B76A32;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
    margin-top: 4px;
  }
  .ea-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .ea-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(162,123,61,0.35); }
  .ea-submit:hover::before { opacity: 1; }
  .ea-submit:active { transform: translateY(0); }
  .ea-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  .ea-submit--loading { pointer-events: none; }
  .ea-submit-arrow { width: 18px; height: 18px; }

  .ea-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #0A0A0A;
    border-radius: 50%;
    animation: ea-spin 0.7s linear infinite;
  }
  @keyframes ea-spin { to { transform: rotate(360deg); } }

  .ea-disclaimer {
    font-size: 11px;
    color: #3a2e22;
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.03em;
  }

  /* ── Success screen ── */
  .ea-success {
    width: 100%;
    max-width: 520px;
    background: linear-gradient(155deg, #100e08, #0a0a0a);
    border: 1px solid rgba(162,123,61,0.2);
    border-radius: 28px;
    padding: 60px 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    box-shadow: 0 40px 120px rgba(0,0,0,0.6);
    animation: ea-fade-up 0.6s ease both;
  }
  @media (max-width: 540px) { .ea-success { padding: 40px 28px; } }

  .ea-success-orb {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(162,123,61,0.15) 0%, transparent 70%);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .ea-checkmark { width: 48px; height: 48px; }
  .ea-circle-draw {
    animation: ea-draw-circle 0.6s ease 0.2s forwards;
    transform-origin: center;
    transform: rotate(-90deg);
  }
  .ea-check-draw { animation: ea-draw-check 0.4s ease 0.8s forwards; }
  @keyframes ea-draw-circle { to { stroke-dashoffset: 0; } }
  @keyframes ea-draw-check  { to { stroke-dashoffset: 0; } }

  .ea-success-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #C9A96E;
    border: 1px solid rgba(162,123,61,0.3);
    border-radius: 100px;
    padding: 5px 14px;
  }
  .ea-success-title {
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: #FAF8F6;
  }
  .ea-success-body {
    font-size: 14px;
    line-height: 1.7;
    color: #98815D;
    max-width: 360px;
  }

  .ea-queue-card {
    width: 100%;
    background: rgba(162,123,61,0.06);
    border: 1px solid rgba(162,123,61,0.2);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .ea-queue-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6b5842;
  }
  .ea-queue-number {
    font-size: 48px;
    font-weight: 900;
    letter-spacing: -0.03em;
    background: linear-gradient(90deg, #A27B3D, #b76a32);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }
  .ea-queue-sub { font-size: 12px; color: #6b5842; margin-top: 4px; }
  .ea-queue-sub strong { color: #AC9F91; }

  .ea-success-sectors {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }
  .ea-sector-chip {
    padding: 5px 12px;
    font-size: 11px;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.05);
    color: #4a3b2a;
    background: transparent;
    transition: all 0.3s;
  }
  .ea-sector-chip--active {
    border-color: rgba(162,123,61,0.4);
    color: #C9A96E;
    background: rgba(162,123,61,0.08);
  }
`;
