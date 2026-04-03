"use client";

import { motion } from "framer-motion";
import type { ContentFields } from "@/lib/getSiteData";

interface ContactPageProps {
  content: ContentFields;
}

export function ContactPage({ content }: ContactPageProps) {
  const phone = String(content.phone ?? "+44 (0)1892 826052");
  const email = String(content.email ?? "mail@albansbarnyard.co.uk");
  const address = String(content.address ?? "Albans Barnyard\nRomford Road\nPembury, Kent\nTN2 4BB");
  const findingUs = String(content.findingUs ?? 'The easiest way to find us is to search for "Albans Barnyard" in Google Maps or Waze. We have a pin that will bring you straight to the farm gate. We\'d recommend this over a postcode, as satnav systems have been known to send visitors somewhere else entirely!');
  const directions = String(content.directions ?? 'From Matfield village on the B2160, find The Poet restaurant (postcode TN12 7JH) and turn into Chestnut Lane beside it. After 300 yards, turn left into Foxhole Lane. Follow the lane down into the valley, then bear right up the hill onto Romford Road. On the brow of the hill, turn right into the farm track marked "Albans Farm and Springhill Trout Fishery." Follow the track to the very end and through some wooden gates into Albans Barnyard.');

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/farm/lambs-field.jpg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Get in Touch
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-3xl text-stone-900 mb-8">
                Send us a Message
              </h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-sans text-xs tracking-wider uppercase text-stone-500 mb-2">Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-stone-200 font-sans text-sm text-stone-900 focus:outline-none focus:border-green-mid transition-colors bg-transparent" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-wider uppercase text-stone-500 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 border border-stone-200 font-sans text-sm text-stone-900 focus:outline-none focus:border-green-mid transition-colors bg-transparent" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-wider uppercase text-stone-500 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 border border-stone-200 font-sans text-sm text-stone-500 focus:outline-none focus:border-green-mid transition-colors bg-transparent appearance-none">
                    <option value="">Select a topic</option>
                    <option value="booking">Booking Enquiry</option>
                    <option value="shop">Farm Shop Order</option>
                    <option value="farm">Farm Visit</option>
                    <option value="other">General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-xs tracking-wider uppercase text-stone-500 mb-2">Message</label>
                  <textarea rows={6} className="w-full px-4 py-3 border border-stone-200 font-sans text-sm text-stone-900 focus:outline-none focus:border-green-mid transition-colors bg-transparent resize-none" placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" className="px-10 py-4 bg-green-dark text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-green-mid transition-colors duration-300">
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pl-8"
            >
              <h2 className="font-serif text-3xl text-stone-900 mb-8">Find Us</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-green-mid mb-3">Address</h3>
                  <p className="font-sans text-stone-600 leading-relaxed">
                    {address.split("\n").map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </p>
                </div>

                <div>
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-green-mid mb-3">Contact</h3>
                  <p className="font-sans text-stone-600">
                    <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="hover:text-green-dark transition-colors">{phone}</a>
                    <br />
                    <a href={`mailto:${email}`} className="hover:text-green-dark transition-colors">{email}</a>
                  </p>
                </div>

                <div>
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-green-mid mb-3">Social</h3>
                  <div className="flex gap-4">
                    <a href="https://www.facebook.com/albansbarnyard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-sm text-stone-600 hover:text-[#1877F2] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </a>
                    <a href="https://www.instagram.com/albansbarnyard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-sm text-stone-600 hover:text-[#E4405F] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                      Instagram
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-green-mid mb-3">Finding Us</h3>
                  <p className="font-sans text-sm text-stone-600 leading-relaxed mb-3">{findingUs}</p>
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-green-mid mb-3 mt-6">Old-Fashioned Directions</h3>
                  <p className="font-sans text-sm text-stone-600 leading-relaxed">{directions}</p>
                </div>
              </div>

              {/* Map */}
              <div className="mt-10 relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <iframe
                  src="https://maps.google.com/maps?q=Albans+Barnyard,+Romford+Road,+Pembury,+Kent+TN2+4BB&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
