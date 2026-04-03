"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ContentFields } from "@/lib/getSiteData";

interface VideoSectionProps {
  content: ContentFields;
}

export function VideoSection({ content }: VideoSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const eyebrow = String(content.eyebrow ?? "Watch");
  const title = String(content.title ?? "Lambs at");
  const titleLine2 = String(content.titleLine2 ?? "Play");
  const description = String(content.description ?? "Our Jacob lambs enjoying spring sunshine on the farm. There\u2019s nothing quite like watching them chase each other across the fields, and guests at Cox Cottage can see it first-hand.");
  const videoUrl = String(content.videoUrl ?? "https://player.vimeo.com/video/315014239?h=aff6d9dfa6&title=0&byline=0&portrait=0");

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
                {eyebrow}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-white leading-tight mb-4">
                {title}
                <br />
                <span className="italic">{titleLine2}</span>
              </h2>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                {description}
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
                  src={videoUrl}
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
