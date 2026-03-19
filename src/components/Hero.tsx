"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0 animate-ken-burns">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/farm/hero-banner.jpg), url(/images/farm/farm-view-1.jpg)",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-sans text-xs tracking-[0.3em] uppercase text-white/80 mb-6"
        >
          The Weald of Kent
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[0.95] mb-8"
        >
          A Home
          <br />
          <span className="italic">from Home</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-sans text-base md:text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Luxurious holiday accommodation on a working farm, nestled in the
          rolling countryside five miles from Tunbridge Wells.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/cox-cottage"
            className="group px-10 py-4 bg-white text-green-dark font-sans text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:bg-cream hover:shadow-lg hover:translate-y-[-1px]"
          >
            Explore the Cottage
          </Link>
          <Link
            href="/cox-cottage#booking"
            className="px-10 py-4 border border-white/60 text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-300 hover:border-white"
          >
            Check Availability
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
