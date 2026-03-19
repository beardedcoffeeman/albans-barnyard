"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: SectionIntroProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-16`}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={`font-sans text-xs tracking-[0.3em] uppercase mb-4 ${
            dark ? "text-gold" : "text-green-mid"
          }`}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight ${
          dark ? "text-white" : "text-stone-900"
        }`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`mt-6 font-sans text-base md:text-lg leading-relaxed ${
            dark ? "text-white/70" : "text-stone-500"
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
