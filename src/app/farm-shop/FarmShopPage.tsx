"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    title: "Single Sheepskin Rug",
    price: "£95",
    description:
      "A luxurious Jacob sheepskin rug, each one unique with distinctive spotted markings. Tanned at the oldest tannery in the country using traditional methods.",
    image: "/images/products/sheepskin-1.jpg",
    details: [
      "100% Jacob sheep fleece",
      "Traditionally tanned in England",
      "Each skin is unique",
      "Approximately 90cm x 60cm",
    ],
  },
  {
    title: "Double Sheepskin Rug",
    price: "£200",
    description:
      "Two matching sheepskins stitched together to create a generous rug, perfect as a throw or beside your bed.",
    image: "/images/products/sheepskin-2.jpg",
    details: [
      "Two matched Jacob skins",
      "Traditionally tanned",
      "Approximately 170cm x 60cm",
      "Perfect as a sofa throw",
    ],
  },
  {
    title: "Pure Farm Honey",
    price: "From £8",
    description:
      "Raw, unblended honey harvested from our hives each summer. The bees forage on wildflowers, clover, and orchard blossoms across the farm.",
    image: "/images/products/bees.jpg",
    details: [
      "Raw & unblended",
      "From our own hives",
      "Available in 227g & 340g jars",
      "Seasonal availability",
    ],
  },
  {
    title: "Rare Breed Meat Box",
    price: "From £50",
    description:
      "Seasonal boxes of rare breed pork and lamb, raised slowly on natural pasture. Our animals are born and reared on the farm with the highest welfare standards.",
    image: "/images/products/cattle.jpg",
    details: [
      "Rare breed pork & lamb",
      "Born and reared on the farm",
      "High welfare, pasture-fed",
      "Seasonal availability",
    ],
  },
];

const sheepskinGallery = [
  "/images/cottage/interior-1.jpg",
  "/images/cottage/interior-2.jpg",
  "/images/cottage/interior-3.jpg",
];

export function FarmShopPage() {
  const productsRef = useRef(null);
  const productsInView = useInView(productsRef, { once: true, margin: "-100px" });

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/products/sheepskin-1.jpg)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">
            Artisan Produce
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white">
            Farm Shop
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-lg text-stone-600 leading-relaxed">
            Everything we sell comes directly from the farm. Our sheepskins are
            from our own Jacob flock, our honey from our own hives, and our meat
            from animals born and raised right here in the Kentish Weald.
          </p>
        </div>
      </section>

      {/* Products */}
      <section ref={productsRef} className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              animate={productsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "" : ""
              }`}
            >
              <div className={`relative aspect-square overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-baseline gap-4 mb-4">
                  <h2 className="font-serif text-3xl md:text-4xl text-stone-900">
                    {product.title}
                  </h2>
                  <span className="font-serif text-2xl text-green-mid">
                    {product.price}
                  </span>
                </div>
                <p className="font-sans text-stone-600 leading-relaxed mb-6">
                  {product.description}
                </p>
                <ul className="space-y-2 mb-8">
                  {product.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-center gap-3 font-sans text-sm text-stone-500"
                    >
                      <svg
                        className="w-4 h-4 text-green-mid flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-block px-8 py-3.5 bg-green-dark text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-green-mid transition-colors"
                >
                  Enquire to Order
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sheepskin styling gallery */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-stone-900 text-center mb-4">
            Styled in the Cottage
          </h2>
          <p className="font-sans text-stone-500 text-center mb-12 max-w-xl mx-auto">
            See how our Jacob sheepskins look in Cox Cottage &mdash; every one
            is unique, just like the sheep it came from.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sheepskinGallery.map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden group">
                <Image
                  src={src}
                  alt={`Sheepskin styling ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
