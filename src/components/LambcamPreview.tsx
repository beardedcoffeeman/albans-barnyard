"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import type { ContentFields } from "@/lib/getSiteData";

interface LambcamPreviewProps {
  content: ContentFields;
}

export function LambcamPreview({ content }: LambcamPreviewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCamera, setActiveCamera] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const title = String(content.title ?? "Lambcam");
  const description = String(content.description ?? "Watch our flock in real-time. During lambing season, you can witness the arrival of new lambs from the comfort of your screen, a true lambing experience from wherever you are. Our Jacob sheep have been a beloved feature of the farm for generations.");

  const cameras = [
    { id: 1, alias: String(content.camera1Alias ?? "620d2145dc98f"), label: String(content.camera1Label ?? "Barn View") },
    { id: 2, alias: String(content.camera2Alias ?? "64135a44aacd3"), label: String(content.camera2Label ?? "Pen View") },
  ];

  return (
    <section ref={ref} className="py-24 md:py-32 bg-green-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Text - 2 cols */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              {/* Live Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-red-400">
                  Live Now
                </span>
              </div>

              <h2 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight mb-6">
                {title}
              </h2>
              <p className="font-sans text-base text-white/70 leading-relaxed mb-8">
                {description}
              </p>

              {/* Camera Switcher */}
              <div className="flex gap-3 mb-8">
                {cameras.map((cam, i) => (
                  <button
                    key={cam.id}
                    onClick={() => {
                      setIsLoaded(false);
                      setActiveCamera(i);
                    }}
                    className={`px-5 py-2.5 font-sans text-sm tracking-wider uppercase transition-all duration-300 ${
                      activeCamera === i
                        ? "bg-white text-green-dark"
                        : "border border-white/30 text-white/70 hover:border-white/60 hover:text-white"
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>

              <Link
                href="/lambcam"
                className="inline-block font-sans text-sm tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors duration-300"
              >
                Full Screen View &rarr;
              </Link>
            </motion.div>
          </div>

          {/* Stream - 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="relative bg-black rounded-sm overflow-hidden shadow-2xl">
              {/* Aspect ratio container */}
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                {/* Loading state */}
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
                      <p className="font-sans text-sm text-white/50">
                        Connecting to camera...
                      </p>
                    </div>
                  </div>
                )}
                <iframe
                  key={cameras[activeCamera].alias}
                  src={`https://g0.ipcamlive.com/player/player.php?alias=${cameras[activeCamera].alias}&skin=white&autoplay=1&mute=1&disableautofullscreen=1&disablezoombutton=1&disableframecapture=1&disabletimelapseplayer=1&disablestorageplayer=1&disabledownloadbutton=1&disableplaybackspeedbutton=1&disablenavigation=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay"
                  onLoad={() => setIsLoaded(true)}
                />
              </div>

              {/* Camera indicator overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="font-sans text-xs text-white/90">
                  Camera {cameras[activeCamera].id} -{" "}
                  {cameras[activeCamera].label}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
