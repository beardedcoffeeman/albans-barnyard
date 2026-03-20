"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src="/images/farm/sunset-tractor.jpg"
                alt="Tractor baling hay at golden hour on the farm"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute -bottom-8 -right-8 w-48 h-48 md:w-64 md:h-64 overflow-hidden border-4 border-white shadow-xl hidden md:block"
            >
              <Image
                src="/images/cottage/interior-11.jpg"
                alt="Cox Cottage upper bedroom"
                fill
                className="object-cover"
                sizes="256px"
              />
            </motion.div>
          </div>

          {/* Text */}
          <div className="lg:pl-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-4"
            >
              Our Story
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-light text-stone-900 leading-tight mb-8"
            >
              Where Countryside
              <br />
              <span className="italic">Meets Comfort</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-5 font-sans text-stone-600 leading-relaxed"
            >
              <p>
                Set in the heart of the Kentish Weald, Alban&apos;s Barnyard is
                a small working farm raising pedigree Jacob sheep and North Devon
                Red Ruby cattle among rolling orchards and ancient woodland. For
                those seeking luxury farm stays in the UK, this is a place where
                the land shapes everything.
              </p>
              <p>
                Cox Cottage has been lovingly designed with sustainability at its
                heart &mdash; powered by ground source heat pump, solar panels,
                and heat recovery ventilation &mdash; without compromising on
                comfort. Dijon limestone floors, a hand-built kitchen, and a wood
                burning stove create the perfect self catering cottage in Kent.
              </p>
              <p>
                Whether you&apos;re watching lambs in spring, tasting our own
                honey in summer, or curling up by the fire in winter, every
                season brings something special.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10"
            >
              <Link
                href="/the-farm"
                className="inline-block px-8 py-3.5 bg-green-dark text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-green-mid transition-colors duration-300"
              >
                Discover the Farm
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
