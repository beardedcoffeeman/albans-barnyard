"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-0 overflow-hidden">
      <div className="relative bg-green-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 items-center">
            {/* Text - 2 cols */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 px-8 py-16 md:py-20 lg:py-24"
            >
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
                Watch
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-white leading-tight mb-4">
                Discover
                <br />
                <span className="italic">Cox Cottage</span>
              </h2>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                Take a tour of the cottage and the farm. See the hand-built
                kitchen, cosy wood stove, spacious bedrooms, and the rolling Kent
                countryside right on the doorstep.
              </p>
            </motion.div>

            {/* Video - 3 cols */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src="https://player.vimeo.com/video/315014239?h=aff6d9dfa6&title=0&byline=0&portrait=0"
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Cox Cottage virtual tour"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
