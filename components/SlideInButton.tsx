"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface SlideInButtonProps {
  text?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function SlideInButton({
  text = "Sign up for Early Access",
  href,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
}: SlideInButtonProps) {
  const content = (
    <div
      className={`group relative flex items-center justify-center overflow-hidden rounded-full py-[14px] px-[26px] transition-colors duration-500 ${fullWidth ? 'w-full' : ''}`}
      style={{
        backgroundColor: "#B76A32",
        border: "1px solid rgba(183, 106, 50, 0.4)",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {/* Expanding background circle on hover */}
      <div
        className="absolute left-1/2 bottom-[-8px] z-0 h-[8px] w-[8px] -translate-x-1/2 rounded-full transition-transform duration-500 ease-out group-hover:scale-[50]"
        style={{ backgroundColor: "#111" }}
      />
      
      {/* Invisible spacer to reserve width */}
      <div className="invisible flex items-center gap-2 text-sm font-semibold tracking-wide h-[19px]">
        <span>{text}</span>
        <ArrowRight className="h-4 w-4" />
      </div>

      {/* Button Content */}
      <div className="absolute z-10 flex items-center gap-2 pr-[12px] transition-transform duration-500 ease-out translate-x-[12px] group-hover:translate-x-0">
        <span className="text-sm font-semibold tracking-wide text-[#FFFFFF] whitespace-nowrap">
          {text}
        </span>
        <div className="opacity-0 translate-x-5 transition-all duration-500 ease-out text-white group-hover:opacity-100 group-hover:translate-x-0">
          {disabled ? (
             <span className="ea-spinner w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin block" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </div>
      </div>
    </div>
  );

  if (href && !onClick && type !== "submit") {
    return (
      <Link href={href} className={`inline-block relative z-20 ${fullWidth ? 'w-full' : ''}`} id="hero-cta-button">
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative z-20 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${fullWidth ? 'w-full block' : 'inline-block'}`}
      style={{ WebkitAppearance: 'none', background: 'transparent', border: 'none', padding: 0 }}
    >
      {content}
    </button>
  );
}
