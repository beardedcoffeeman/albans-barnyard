"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const seasons = [
  {
    name: "Spring",
    description:
      "Lambing season is the highlight of the year. Watch newborn lambs take their first steps, enjoy a lambing experience in the shed, and feel the farm coming alive after winter.",
    image: "/images/farm/sheep-1.jpg",
  },
  {
    name: "Summer",
    description:
      "The hives are buzzing, the orchards are heavy with fruit, and the cattle graze contentedly in lush pastures. Our honey harvest takes place in late summer.",
    image: "/images/farm/flock-summer.jpg",
  },
  {
    name: "Autumn",
    description:
      "The farm takes on golden hues as the orchards turn. It's tupping time for the sheep, and we prepare our seasonal meat boxes from our rare breed livestock.",
    image: "/images/farm/countryside.jpg",
  },
  {
    name: "Winter",
    description:
      "A magical time to visit. Crisp mornings, frosty fields, and the warmth of the wood burner waiting for you back at the cottage. The farm's robin is always a welcome visitor.",
    image: "/images/farm/landscape-main.jpg",
  },
];

const farmGallery = [
  { src: "/images/farm/ewe-and-lamb.jpg", alt: "Jacob ewe and lamb in summer meadow" },
  { src: "/images/farm/farm-exterior.jpg", alt: "North Devon Red Ruby cattle grazing" },
  { src: "/images/farm/lambs-standing.jpg", alt: "Adorable Jacob lambs in spring" },
  { src: "/images/farm/flock-running.jpg", alt: "Jacob flock running through golden fields" },
  { src: "/images/farm/countryside.jpg", alt: "Jacob sheep portrait close-up" },
  { src: "/images/farm/sheep-1.jpg", alt: "Jacob sheep resting under a tree" },
  { src: "/images/farm/flock-summer.jpg", alt: "Flock grazing in tall summer grass" },
  { src: "/images/farm/farmhouse.jpg", alt: "Jacob ewe with spotted lamb" },
  { src: "/images/farm/sheep-3.jpg", alt: "Jacob sheep and lamb together" },
  { src: "/images/farm/sheep-2.jpg", alt: "Jacob sheep in the paddock" },
  { src: "/images/farm/bees-honeycomb.jpg", alt: "Bees on honeycomb from our hives" },
  { src: "/images/farm/sunset-tractor.jpg", alt: "Hay baling at golden hour" },
];

export function FarmPage() {
  const introRef = useRef(null);
  const seasonsRef = useRef(null);
  const galleryRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-100px" });
  const seasonsInView = useInView(seasonsRef, { once: true, margin: "-100px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/farm/farm-exterior.jpg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            A Working Farm
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white">
            The Farm
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section ref={introRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-4">
                Our Heritage
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 leading-tight mb-8">
                Traditional Breeds,
                <br />
                <span className="italic">Modern Values</span>
              </h2>
              <div className="space-y-5 font-sans text-stone-600 leading-relaxed">
                <p>
                  Albans Barnyard is a small family farm nestled in the
                  Kentish Weald, where we raise pedigree Jacob sheep and North
                  Devon Red Ruby cattle using traditional, high-welfare methods.
                </p>
                <p>
                  Our Jacob sheep are a beautiful four-horned British breed with
                  distinctive spotted fleeces. The flock has been carefully
                  bred over many years, producing characterful lambs that visitors
                  fall in love with each spring.
                </p>
                <p>
                  The North Devon Red Ruby cattle are one of Britain&apos;s
                  oldest native breeds, known for their rich, well-marbled beef.
                  They thrive on our natural pastures, supplemented only with
                  our own hay and silage.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={introInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/farm/countryside.jpg"
                  alt="Jacob sheep portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden mt-8">
                <Image
                  src="/images/farm/farm-exterior.jpg"
                  alt="Red Ruby cattle"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seasons */}
      <section ref={seasonsRef} className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={seasonsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-4">
              Throughout the Year
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900">
              Every Season Tells a Story
            </h2>
          </motion.div>

          <div className="space-y-24">
            {seasons.map((season, i) => (
              <motion.div
                key={season.name}
                initial={{ opacity: 0, y: 30 }}
                animate={seasonsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                <div className={`relative aspect-[4/3] overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Image
                    src={season.image}
                    alt={season.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
                    {season.name}
                  </h3>
                  <p className="font-sans text-stone-600 leading-relaxed mb-6">
                    {season.description}
                  </p>
                  {season.name === "Spring" && (
                    <Link
                      href="/lambcam"
                      className="inline-block px-8 py-3 bg-green-dark text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-green-mid transition-colors"
                    >
                      Watch the Lambcam
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section ref={galleryRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-light text-stone-900 text-center mb-12"
          >
            Farm Gallery
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {farmGallery.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={galleryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative overflow-hidden group ${
                  i === 0 || i === 5 ? "md:col-span-2 aspect-[2/1]" : "aspect-square"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-dark text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-6">
            Experience the Farm First-Hand
          </h2>
          <p className="font-sans text-white/60 mb-8">
            Book a stay at our cottage near Tunbridge Wells and explore the farm at your leisure.
          </p>
          <Link
            href="/cox-cottage#booking"
            className="inline-block px-10 py-4 bg-gold text-green-dark font-sans text-sm tracking-[0.2em] uppercase font-medium hover:bg-gold-light transition-colors"
          >
            Book Your Stay
          </Link>
        </div>
      </section>
    </>
  );
}
