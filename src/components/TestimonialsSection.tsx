"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "An absolutely beautiful cottage in a stunning setting. Watching the lambs from the garden was magical. We didn't want to leave.",
    author: "Sarah & James",
    date: "Spring 2025",
  },
  {
    quote:
      "The perfect winter retreat. The wood burner, underfloor heating, and gorgeous kitchen made it feel truly special. The farm honey was incredible.",
    author: "The Richardson Family",
    date: "Winter 2024",
  },
  {
    quote:
      "We've stayed twice now and it gets better every time. The attention to detail is extraordinary — from the Sonos system to the beautiful bathroom tiles.",
    author: "Mark & Claire",
    date: "Summer 2024",
  },
  {
    quote:
      "A real gem hidden in the Kent countryside. The cottage is immaculate and the farm experience for our children was unforgettable.",
    author: "The Patels",
    date: "Easter 2024",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-4"
        >
          Guest Book
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-stone-900 leading-tight mb-16"
        >
          What Our Guests Say
        </motion.h2>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative min-h-[200px]"
        >
          {/* Decorative quote mark */}
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-serif text-9xl text-stone-200 leading-none select-none">
            &ldquo;
          </span>

          <div className="relative z-10">
            <p className="font-serif text-2xl md:text-3xl text-stone-800 leading-relaxed italic mb-8">
              &ldquo;{testimonials[active].quote}&rdquo;
            </p>
            <p className="font-sans text-sm tracking-wider uppercase text-stone-500">
              {testimonials[active].author}
            </p>
            <p className="font-sans text-xs text-stone-400 mt-1">
              {testimonials[active].date}
            </p>
          </div>
        </motion.div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                active === i
                  ? "bg-green-dark w-8"
                  : "bg-stone-300 hover:bg-stone-400"
              }`}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
