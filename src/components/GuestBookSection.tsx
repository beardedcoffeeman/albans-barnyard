"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

const guestBookPages = [
  "https://www.albansbarnyard.co.uk/wp-content/uploads/2025/05/coxcottageguestbook9.pdf",
  "https://www.albansbarnyard.co.uk/wp-content/uploads/2024/04/coxcottageguestbook8.pdf",
  "https://www.albansbarnyard.co.uk/wp-content/uploads/2023/10/coxcottageguestbook7.pdf",
];

const testimonials = [
  {
    quote:
      "An absolutely beautiful cottage in a stunning setting. Watching the lambs from the garden was magical. We didn't want to leave.",
    author: "Sarah & James",
    date: "Spring 2025",
  },
  {
    quote:
      "The perfect winter retreat. The wood burner, underfloor heating, and gorgeous kitchen made it feel truly special.",
    author: "The Richardson Family",
    date: "Winter 2024",
  },
  {
    quote:
      "We've stayed twice now and it gets better every time. The attention to detail is extraordinary.",
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

export function GuestBookSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);
  const [showBook, setShowBook] = useState(false);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-4">
            Guest Book
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-stone-900 leading-tight mb-4">
            What Our Guests Say
          </h2>
          <p className="font-sans text-stone-500 max-w-lg mx-auto">
            Real entries from our handwritten guest book at Cox Cottage,
            complete with drawings, doodles, and heartfelt messages.
          </p>
        </motion.div>

        {/* Testimonial quotes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative min-h-[180px] mb-12"
        >
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-serif text-[120px] text-stone-100 leading-none select-none">
            &ldquo;
          </span>
          <div className="relative z-10 text-center">
            <p className="font-serif text-2xl md:text-3xl text-stone-800 leading-relaxed italic mb-6 max-w-3xl mx-auto">
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
        <div className="flex justify-center gap-3 mb-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                active === i
                  ? "bg-green-dark w-8"
                  : "bg-stone-300 w-2.5 hover:bg-stone-400"
              }`}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Guest Book Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={() => setShowBook(!showBook)}
            className="w-full group"
          >
            <div className="relative bg-cream rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left - visual */}
                <div className="relative h-64 md:h-auto bg-green-dark flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <text x="20" y="40" className="fill-white text-[8px]" style={{ fontFamily: "serif", fontStyle: "italic" }}>What a wonderful stay...</text>
                      <text x="30" y="60" className="fill-white text-[7px]" style={{ fontFamily: "serif" }}>We loved every moment</text>
                      <text x="15" y="80" className="fill-white text-[9px]" style={{ fontFamily: "serif", fontStyle: "italic" }}>The lambs were adorable!</text>
                      <text x="40" y="100" className="fill-white text-[6px]" style={{ fontFamily: "serif" }}>Beautiful cottage, beautiful farm</text>
                      <text x="10" y="120" className="fill-white text-[8px]" style={{ fontFamily: "serif", fontStyle: "italic" }}>Can&apos;t wait to come back</text>
                      <text x="25" y="140" className="fill-white text-[7px]" style={{ fontFamily: "serif" }}>Thank you Simon &amp; Lesley</text>
                      <text x="35" y="160" className="fill-white text-[9px]" style={{ fontFamily: "serif", fontStyle: "italic" }}>A true hidden gem</text>
                      <text x="20" y="180" className="fill-white text-[6px]" style={{ fontFamily: "serif" }}>Five stars from us!</text>
                    </svg>
                  </div>
                  <div className="relative text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-white/30 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-2xl text-white mb-2">
                      The Guest Book
                    </h3>
                    <p className="font-sans text-sm text-white/60">
                      9 volumes of handwritten memories
                    </p>
                  </div>
                </div>

                {/* Right - description */}
                <div className="p-8 md:p-10 flex flex-col justify-center text-left">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-green-mid mb-3">
                    Authentic Reviews
                  </p>
                  <h3 className="font-serif text-2xl text-stone-900 mb-3">
                    Handwritten by Our Guests
                  </h3>
                  <p className="font-sans text-sm text-stone-500 leading-relaxed mb-6">
                    Every guest leaves their mark in our handwritten guest book
                   , complete with personal stories, drawings, children&apos;s
                    doodles, and heartfelt thank-yous. No online reviews can
                    capture the warmth of these pages.
                  </p>
                  <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-green-dark group-hover:text-green-mid transition-colors">
                    {showBook ? "Close Guest Book" : "Browse the Guest Book"}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Embedded Guest Book */}
        {showBook && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8"
          >
            <div className="bg-cream rounded-2xl p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif text-lg text-stone-900">Browse the Volumes</h4>
                <div className="flex gap-2 overflow-x-auto">
                  {guestBookPages.map((_, i) => (
                    <Link
                      key={i}
                      href={guestBookPages[i]}
                      target="_blank"
                      className="flex-shrink-0 px-4 py-2 bg-white rounded-lg font-sans text-xs text-stone-600 hover:text-green-dark hover:shadow-sm transition-all"
                    >
                      Vol. {guestBookPages.length - i}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm" style={{ height: "550px" }}>
                <iframe
                  src={`${guestBookPages[0]}#toolbar=0&navpanes=0`}
                  className="w-full h-full border-0"
                  title="Cox Cottage Guest Book"
                />
              </div>
              <p className="font-sans text-xs text-stone-400 text-center mt-4">
                Scroll through to read handwritten entries, see drawings, and hear what guests loved.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
