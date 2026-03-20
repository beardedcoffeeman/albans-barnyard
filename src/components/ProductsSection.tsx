"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    title: "Pure Honey",
    description:
      "Raw, unblended honey from our own hives, harvested each summer from the wildflowers and orchards of the farm.",
    image: "/images/products/bees.jpg",
    href: "/farm-shop",
  },
  {
    title: "Sheepskins",
    description:
      "Luxurious Jacob sheepskin rugs, tanned at the oldest tannery in the country using traditional methods.",
    image: "/images/products/sheepskin-1.jpg",
    href: "/farm-shop",
  },
  {
    title: "Meat Boxes",
    description:
      "Seasonal boxes of rare breed pork and lamb, raised slowly on natural pasture right here on the farm.",
    image: "/images/products/meat-box.jpg",
    href: "/farm-shop",
  },
];

export function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-4 text-center"
        >
          From the Farm
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-stone-900 leading-tight text-center mb-16"
        >
          Farm Shop
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
            >
              <Link href={product.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-2 group-hover:text-green-dark transition-colors">
                  {product.title}
                </h3>
                <p className="font-sans text-sm text-stone-500 leading-relaxed">
                  {product.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-green-dark text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-green-mid transition-colors duration-300"
          >
            Enquire to Order
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
