"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <motion.div
      className={`relative flex items-center justify-center overflow-hidden rounded-full py-[14px] px-[26px] ${fullWidth ? 'w-full' : ''}`}
      onHoverStart={() => !disabled && setIsHovered(true)}
      onHoverEnd={() => !disabled && setIsHovered(false)}
      initial="rest"
      animate={isHovered && !disabled ? "hover" : "rest"}
      style={{
        backgroundColor: "#B76A32",
        border: "1px solid rgba(183, 106, 50, 0.4)",
        opacity: disabled ? 0.6 : 1,
      }}
      whileHover={!disabled ? { borderColor: "rgba(255, 255, 255, 0.1)" } : {}}
    >
      <motion.div
        className="absolute left-1/2 bottom-[-8px] z-0 h-[8px] w-[8px] -translate-x-1/2 rounded-full"
        style={{ backgroundColor: "#111" }}
        variants={{
          rest: { scale: 1 },
          hover: { scale: 50 },
        }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
      />
      
      <div className="invisible flex items-center gap-2 text-sm font-semibold tracking-wide h-[19px]">
        <span>{text}</span>
        <ArrowRight className="h-4 w-4" />
      </div>

      <motion.div
        className="absolute z-10 flex items-center gap-2 pr-[12px]"
        variants={{
          rest: { x: 12 },
          hover: { x: 0 },
        }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
      >
        <span className="text-sm font-semibold tracking-wide text-[#FFFFFF] whitespace-nowrap">
          {text}
        </span>
        <motion.div
          variants={{
            rest: { opacity: 0, x: 20, color: "#FFFFFF" },
            hover: { opacity: 1, x: 0, color: "#FFFFFF" },
          }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
        >
          {disabled ? (
             <span className="ea-spinner w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin block" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
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
