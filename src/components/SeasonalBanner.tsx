"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import type { ContentFields } from "@/lib/getSiteData";
import type { SiteSettings } from "@/lib/settingsStore";

interface SeasonalBannerProps {
  content: ContentFields;
  settings: SiteSettings;
}

export function SeasonalBanner({ content, settings }: SeasonalBannerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const season = String(content.season ?? "Spring 2026");
  const title = String(content.title ?? "Lambing Season");
  const titleLine2 = String(content.titleLine2 ?? "is Here");
  const subtitle = String(content.subtitle ?? "Watch our Jacob ewes and their lambs live on the Lambcam, or book a luxury farm stay with animals and experience it first-hand.");
  const backgroundImage = String(content.backgroundImage ?? "/images/farm/flock-summer.jpg");
  const cta1Text = String(content.cta1Text ?? "Watch Live");
  const cta1Link = String(content.cta1Link ?? "/lambcam");
  const cta2Text = String(content.cta2Text ?? "Book a Spring Stay");
  const cta2Link = String(content.cta2Link ?? "/cox-cottage#booking");

  // Hide lambcam CTA when lambcam is disabled
  const showLambcamCta = settings.lambcamEnabled && cta1Link === "/lambcam";

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-green-dark/55" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4"
        >
          {season}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6"
        >
          {title}
          <br />
          <span className="italic">{titleLine2}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {showLambcamCta && (
            <Link
              href={cta1Link}
              className="px-10 py-4 bg-white text-green-dark font-sans text-sm tracking-[0.2em] uppercase hover:bg-cream transition-colors duration-300"
            >
              {cta1Text}
            </Link>
          )}
          <Link
            href={cta2Link}
            className={`px-10 py-4 font-sans text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${
              showLambcamCta
                ? "border border-white/60 text-white hover:bg-white/10"
                : "bg-white text-green-dark hover:bg-cream"
            }`}
          >
            {cta2Text}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
