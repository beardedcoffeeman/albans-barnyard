"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const cameras = [
  {
    id: 1,
    alias: "620d2145dc98f",
    label: "Barn View",
    description: "Wide angle view of the main lambing shed",
  },
  {
    id: 2,
    alias: "64135a44aacd3",
    label: "Pen View",
    description: "Close-up view of the individual lambing pens",
  },
];

export function LambcamFullPage() {
  const [activeCamera, setActiveCamera] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPiP, setIsPiP] = useState(false);

  return (
    <>
      {/* Hero header */}
      <section className="relative pt-32 pb-16 bg-green-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="font-sans text-sm tracking-[0.2em] uppercase text-red-400">
              Live from the Farm
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4">
            Lambcam
          </h1>
          <p className="font-sans text-lg text-white/60 max-w-2xl">
            Watch our pedigree Jacob sheep live from the lambing shed. During
            lambing season, you might be lucky enough to witness a birth.
          </p>
        </div>
      </section>

      {/* Main Stream */}
      <section className="bg-stone-900 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Camera selector tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {cameras.map((cam, i) => (
                <button
                  key={cam.id}
                  onClick={() => {
                    setIsLoaded(false);
                    setActiveCamera(i);
                  }}
                  className={`group flex items-center gap-3 px-6 py-3 transition-all duration-300 ${
                    activeCamera === i
                      ? "bg-white text-stone-900"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full ${
                        activeCamera === i
                          ? "bg-red-500 animate-live-pulse"
                          : "bg-white/40"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        activeCamera === i ? "bg-red-500" : "bg-white/40"
                      }`}
                    />
                  </span>
                  <div className="text-left">
                    <span className="block font-sans text-sm font-medium tracking-wider uppercase">
                      Camera {cam.id}
                    </span>
                    <span
                      className={`block font-sans text-xs ${
                        activeCamera === i ? "text-stone-500" : "text-white/40"
                      }`}
                    >
                      {cam.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* View controls */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setIsPiP(!isPiP)}
                className={`px-4 py-2 font-sans text-xs tracking-wider uppercase transition-all duration-300 ${
                  isPiP
                    ? "bg-gold text-green-dark"
                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                }`}
              >
                {isPiP ? "Single View" : "Dual View"}
              </button>
            </div>
          </div>

          {/* Stream container */}
          <div className={`relative ${isPiP ? "grid grid-cols-2 gap-4" : ""}`}>
            {/* Main stream */}
            <motion.div
              layout
              className="relative bg-black rounded-sm overflow-hidden shadow-2xl"
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: isPiP ? "56.25%" : "50%" }}
              >
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                    <div className="text-center">
                      <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
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

                {/* Camera overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="font-sans text-xs text-white/90">
                    {cameras[activeCamera].label}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Second stream (PiP mode) */}
            {isPiP && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-black rounded-sm overflow-hidden shadow-2xl"
              >
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://g0.ipcamlive.com/player/player.php?alias=${cameras[activeCamera === 0 ? 1 : 0].alias}&skin=white&autoplay=1&mute=1&disableautofullscreen=1&disablezoombutton=1&disableframecapture=1&disabletimelapseplayer=1&disablestorageplayer=1&disabledownloadbutton=1&disableplaybackspeedbutton=1&disablenavigation=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span className="font-sans text-xs text-white/90">
                      {cameras[activeCamera === 0 ? 1 : 0].label}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Info section below stream */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 mb-4">
                About Our Flock
              </h3>
              <p className="font-sans text-sm text-stone-600 leading-relaxed">
                Our pedigree Jacob sheep are a traditional four-horned British
                breed. The flock has been carefully bred over many years,
                producing beautiful spotted fleeces and characterful lambs.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-stone-900 mb-4">
                Lambing Season
              </h3>
              <p className="font-sans text-sm text-stone-600 leading-relaxed">
                Lambing typically runs from late February through March. During
                this time, the cameras are active around the clock. This offers
                a live lambing experience from wherever you are. You might
                see ewes being brought in, lambs being born, and their first
                wobbly steps.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-stone-900 mb-4">
                Visit in Person
              </h3>
              <p className="font-sans text-sm text-stone-600 leading-relaxed">
                Guests staying at Cox Cottage can visit the lambing shed and
                enjoy a lamb feeding experience during their stay. There&apos;s
                nothing quite like meeting a newborn lamb up close.
              </p>
            </div>
          </div>

          {/* Farm images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              "https://www.albansbarnyard.co.uk/wp-content/uploads/2019/01/IMG_2225.jpg",
              "https://www.albansbarnyard.co.uk/wp-content/uploads/2019/01/lamb-141-triplet-3.jpg",
              "https://www.albansbarnyard.co.uk/wp-content/uploads/2019/01/P1010854.jpg",
              "https://www.albansbarnyard.co.uk/wp-content/uploads/2019/01/P1010985-2.jpg",
            ].map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden">
                <Image
                  src={src}
                  alt="Farm life at Albans Barnyard"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
