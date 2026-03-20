"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface AvailableDate {
  date: string;
  pricePerNight?: number;
}

const heroImage = "/images/cottage/cottages-05.jpg";

const galleryImages = [
  { src: "/images/cottage/cottages-07.jpg", alt: "Open plan living room" },
  { src: "/images/cottage/cottages-11.jpg", alt: "Upper bedroom with ensuite" },
  { src: "/images/cottage/cottages-10.jpg", alt: "Master bedroom" },
  { src: "/images/cottage/cottages-09.jpg", alt: "Hand-built kitchen" },
  { src: "/images/cottage/cottages-08.jpg", alt: "Dining table with tulips" },
  { src: "/images/cottage/cottages-12.jpg", alt: "Bedroom with wardrobe and dressing table" },
  { src: "/images/cottage/cottages-06.jpg", alt: "Private patio and garden" },
  { src: "/images/cottage/cottages-05.jpg", alt: "Cottage exterior" },
  { src: "/images/cottage/cottages-04.jpg", alt: "View over the Weald of Kent" },
];

const amenities = [
  {
    category: "Kitchen",
    items: [
      "Hand-built wooden kitchen",
      "Granite worktops",
      "Integrated Neff appliances",
      "Full-size fridge freezer",
      "Nespresso coffee machine",
      "Dishwasher",
    ],
  },
  {
    category: "Living",
    items: [
      "Dijon limestone flooring",
      "Charnwood wood burning stove",
      "Underfloor heating throughout",
      "Sonos audio system",
      "Freesat TV & DVD collection",
      "Wi-Fi & wired internet",
    ],
  },
  {
    category: "Bedrooms",
    items: [
      "Ground floor king bed (converts to twin)",
      "Ensuite shower room",
      "Upper floor double bed",
      "Juliet balcony",
      "Ensuite with shower-over-bath",
      "Premium bed linen & towels",
    ],
  },
  {
    category: "Outdoor",
    items: [
      "Private rear garden",
      "Patio with outdoor seating",
      "Parking for two cars",
      "Farm walks on the doorstep",
      "BBQ available on request",
    ],
  },
];

const faqs = [
  {
    q: "Are pets welcome?",
    a: "We're sorry but we are unable to accommodate pets at Cox Cottage to keep it allergy-free for all guests.",
  },
  {
    q: "What day can we arrive?",
    a: "Kent cottage holidays at Cox Cottage can start on any day of the week, subject to availability. Minimum stay is typically 2 nights.",
  },
  {
    q: "How close is the nearest restaurant?",
    a: "The Poet at Matfield is a lovely gastropub just a 5-minute drive away. Tunbridge Wells has a wide range of restaurants 15 minutes away.",
  },
  {
    q: "Can we visit the farm animals?",
    a: "Absolutely! Guests are welcome to walk around the farm, see the sheep and cattle, and during lambing season, enjoy a hands-on lamb feeding experience in the lambing shed.",
  },
  {
    q: "Can we order farm produce?",
    a: "Yes, our honey, sheepskins and meat boxes can be ordered in advance of your stay or from our farm shop page.",
  },
  {
    q: "How far is London?",
    a: "London is approximately one hour by car or train, making us one of the most accessible luxury farm stays near London. Tunbridge Wells station has regular services to London Bridge and Charing Cross.",
  },
];

export function CottagePage() {
  const galleryRef = useRef(null);
  const amenitiesRef = useRef(null);
  const faqRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });
  const amenitiesInView = useInView(amenitiesRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [availability, setAvailability] = useState<AvailableDate[]>([]);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    message: "",
  });
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [bookingError, setBookingError] = useState("");
  const [calMonth, setCalMonth] = useState(new Date());

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/availability");
      const data = await res.json();
      setAvailability(data);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const availableSet = new Set(availability.map((d) => d.date));

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus("submitting");
    setBookingError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingForm,
          guests: Number(bookingForm.guests),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || "Something went wrong");
        setBookingStatus("error");
      } else {
        setBookingStatus("success");
      }
    } catch {
      setBookingError("Network error. Please try again.");
      setBookingStatus("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
          <Image
            src={heroImage}
            alt="Cox Cottage exterior with hanging baskets"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            style={{ objectPosition: "center 75%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-6xl font-light text-stone-900 mb-6"
          >
            Cox Cottage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans text-lg text-stone-600 leading-relaxed"
          >
            A beautifully restored holiday cottage in Kent with two spacious ensuite
            bedrooms, an open-plan kitchen and living area with wood burning
            stove, and a private garden overlooking the farm. Designed with
            sustainability and luxury in equal measure.
          </motion.p>
        </div>
      </section>

      {/* Welcome Touch */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/cottage/welcome-hamper.png"
                alt="Welcome hamper with eggs, honey, cake and local produce"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-4">
                A Warm Welcome
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-stone-900 mb-6">
                The Little Touches <span className="italic">That Matter</span>
              </h2>
              <p className="font-sans text-stone-600 leading-relaxed">
                Every stay begins with a welcome hamper of farm produce:
                freshly laid eggs, our own honey, homemade cake, and a selection
                of local treats. It&apos;s our way of saying welcome to the farm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Banner */}
      <section className="py-16 bg-green-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: "sun",
                title: "Solar Powered",
                text: "Roof-mounted solar panels generate renewable energy",
              },
              {
                icon: "earth",
                title: "Ground Source Heat",
                text: "Geothermal heat pump for efficient underfloor heating",
              },
              {
                icon: "wind",
                title: "Heat Recovery",
                text: "Mechanical ventilation with heat recovery system",
              },
            ].map((item) => (
              <div key={item.title}>
                <div className="w-10 h-10 mx-auto mb-3 text-gold">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.icon === "sun" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    )}
                    {item.icon === "earth" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    )}
                    {item.icon === "wind" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-white mb-2">{item.title}</h3>
                <p className="font-sans text-sm text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section ref={galleryRef} className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-light text-stone-900 text-center mb-12"
          >
            Gallery
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 20 }}
                animate={galleryInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative overflow-hidden group ${
                  i === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={i === 0 ? "(max-width: 768px) 50vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section ref={amenitiesRef} id="amenities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={amenitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-light text-stone-900 text-center mb-16"
          >
            Amenities
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {amenities.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={amenitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-6">
                  {group.category}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 font-sans text-sm text-stone-600"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 text-green-mid flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 bg-green-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">
              Book Your Stay
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Check Availability
            </h2>
            <p className="font-sans text-base text-white/70 leading-relaxed max-w-xl mx-auto">
              Browse our available dates below and submit a booking request.
              We&apos;ll confirm your stay within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Mini Calendar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setCalMonth(
                      new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1)
                    )
                  }
                  className="p-1.5 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="font-serif text-lg text-white">
                  {calMonth.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  onClick={() =>
                    setCalMonth(
                      new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1)
                    )
                  }
                  className="p-1.5 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <div key={d} className="text-center text-xs text-white/40 py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({
                  length:
                    (new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay() + 6) % 7,
                }).map((_, i) => (
                  <div key={`e-${i}`} className="aspect-square" />
                ))}
                {Array.from({
                  length: new Date(
                    calMonth.getFullYear(),
                    calMonth.getMonth() + 1,
                    0
                  ).getDate(),
                }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isAvail = availableSet.has(dateStr);
                  const isPast = dateStr < new Date().toISOString().split("T")[0];
                  const isCheckIn = bookingForm.checkIn === dateStr;
                  const isCheckOut = bookingForm.checkOut === dateStr;
                  const isInRange =
                    bookingForm.checkIn &&
                    bookingForm.checkOut &&
                    dateStr > bookingForm.checkIn &&
                    dateStr < bookingForm.checkOut;

                  return (
                    <button
                      key={dateStr}
                      disabled={isPast || !isAvail}
                      onClick={() => {
                        if (!bookingForm.checkIn || bookingForm.checkOut) {
                          setBookingForm((f) => ({
                            ...f,
                            checkIn: dateStr,
                            checkOut: "",
                          }));
                        } else if (dateStr > bookingForm.checkIn) {
                          setBookingForm((f) => ({ ...f, checkOut: dateStr }));
                        } else {
                          setBookingForm((f) => ({
                            ...f,
                            checkIn: dateStr,
                            checkOut: "",
                          }));
                        }
                      }}
                      className={`aspect-square rounded flex items-center justify-center text-sm font-sans transition-all ${
                        isPast
                          ? "text-white/15 cursor-not-allowed"
                          : isCheckIn || isCheckOut
                            ? "bg-gold text-green-dark font-semibold"
                            : isInRange
                              ? "bg-gold/30 text-white"
                              : isAvail
                                ? "bg-white/10 text-white hover:bg-white/20"
                                : "text-white/20 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="w-3 h-3 rounded bg-white/10" />
                  Available
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="w-3 h-3 rounded bg-gold" />
                  Selected
                </div>
              </div>
              {availability.length === 0 && (
                <p className="mt-4 text-center text-sm text-white/40">
                  No availability set yet. Please contact us directly.
                </p>
              )}
            </div>

            {/* Booking Form */}
            <div>
              {bookingStatus === "success" ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-2">
                    Request Sent!
                  </h3>
                  <p className="font-sans text-white/60 text-sm">
                    Thank you for your interest in Cox Cottage. We&apos;ll
                    review your request and get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your name *"
                      value={bookingForm.name}
                      onChange={(e) =>
                        setBookingForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email address *"
                      value={bookingForm.email}
                      onChange={(e) =>
                        setBookingForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/40 mb-1 font-sans">
                        Check-in *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.checkIn}
                        onChange={(e) =>
                          setBookingForm((f) => ({ ...f, checkIn: e.target.value }))
                        }
                        className="w-full px-5 py-3.5 bg-white/10 border border-white/20 text-white font-sans text-sm focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1 font-sans">
                        Check-out *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.checkOut}
                        onChange={(e) =>
                          setBookingForm((f) => ({ ...f, checkOut: e.target.value }))
                        }
                        className="w-full px-5 py-3.5 bg-white/10 border border-white/20 text-white font-sans text-sm focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      value={bookingForm.guests}
                      onChange={(e) =>
                        setBookingForm((f) => ({ ...f, guests: e.target.value }))
                      }
                      className="w-full px-5 py-3.5 bg-white/10 border border-white/20 text-white font-sans text-sm focus:outline-none focus:border-gold transition-colors appearance-none"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="w-full px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <textarea
                    placeholder="Any special requests..."
                    rows={3}
                    value={bookingForm.message}
                    onChange={(e) =>
                      setBookingForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="w-full px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                  {bookingError && (
                    <p className="font-sans text-sm text-red-400">{bookingError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={bookingStatus === "submitting"}
                    className="w-full sm:w-auto px-12 py-4 bg-gold text-green-dark font-sans text-sm tracking-[0.2em] uppercase font-medium hover:bg-gold-light transition-colors duration-300 disabled:opacity-50"
                  >
                    {bookingStatus === "submitting"
                      ? "Submitting..."
                      : "Request Booking"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl font-light text-stone-900 text-center mb-16"
          >
            Frequently Asked
          </motion.h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border-b border-stone-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left"
                >
                  <span className="font-serif text-xl text-stone-900 pr-8">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-green-mid transition-transform duration-300 ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-40 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="font-sans text-sm text-stone-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
