"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function SeasonalBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background - lambs on the farm */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/farm/flock-summer.jpg)",
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
          Spring 2026
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6"
        >
          Lambing Season
          <br />
          <span className="italic">is Here</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Watch our Jacob ewes and their lambs live on the Lambcam, or book a
          luxury farm stay with animals and experience it first-hand.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/lambcam"
            className="px-10 py-4 bg-white text-green-dark font-sans text-sm tracking-[0.2em] uppercase hover:bg-cream transition-colors duration-300"
          >
            Watch Live
          </Link>
          <Link
            href="/cox-cottage#booking"
            className="px-10 py-4 border border-white/60 text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-white/10 transition-colors duration-300"
          >
            Book a Spring Stay
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
