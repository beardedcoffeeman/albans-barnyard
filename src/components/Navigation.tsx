"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteSettings } from "@/lib/settingsStore";

interface NavigationProps {
  settings: SiteSettings;
  content?: Record<string, string | string[] | boolean | number>;
}

export function Navigation({ settings, content }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Only homepage gets the transparent nav
  const isHomepage = pathname === "/";
  const showTransparent = isHomepage && !scrolled;

  const navLinks = useMemo(() => {
    const all = [
      { href: "/", label: String(content?.homeLabel ?? "Home") },
      { href: "/cox-cottage", label: String(content?.cottageLabel ?? "Cox Cottage") },
      { href: "/lambcam", label: String(content?.lambcamLabel ?? "Lambcam") },
      { href: "/the-farm", label: String(content?.farmLabel ?? "The Farm") },
      { href: "/farm-shop", label: String(content?.shopLabel ?? "Farm Shop") },
      { href: "/contact", label: String(content?.contactLabel ?? "Contact") },
    ];
    return all.filter(
      (link) => link.href !== "/lambcam" || settings.lambcamMenuVisible
    );
  }, [content, settings.lambcamMenuVisible]);

  const logoText = String(content?.logoText ?? "Albans Barnyard");
  const bookNowText = String(content?.bookNowText ?? "Book Now");
  const bookNowLink = String(content?.bookNowLink ?? "/cox-cottage#booking");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showTransparent
            ? "bg-transparent py-6"
            : "bg-white/95 backdrop-blur-md shadow-sm py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.span
              whileHover={{ opacity: 0.8 }}
              className={`font-serif text-2xl font-semibold tracking-wide transition-colors duration-500 ${
                showTransparent ? "text-white" : "text-green-dark"
              }`}
            >
              {logoText}
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-sans font-medium tracking-widest uppercase transition-colors duration-300 ${
                  showTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-stone-600 hover:text-green-dark"
                } ${pathname === link.href ? (showTransparent ? "text-white" : "text-green-dark") : ""}`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      showTransparent ? "bg-white/60" : "bg-green-dark"
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            <Link
              href={bookNowLink}
              className="ml-4 px-6 py-2.5 bg-green-dark text-white text-sm font-sans font-medium tracking-widest uppercase hover:bg-green-mid transition-colors duration-300"
            >
              {bookNowText}
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen
                  ? "rotate-45 translate-y-2 bg-stone-900"
                  : showTransparent
                    ? "bg-white"
                    : "bg-stone-900"
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen
                  ? "opacity-0"
                  : showTransparent
                    ? "bg-white"
                    : "bg-stone-900"
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen
                  ? "-rotate-45 -translate-y-2 bg-stone-900"
                  : showTransparent
                    ? "bg-white"
                    : "bg-stone-900"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-serif text-3xl transition-colors ${
                    pathname === link.href
                      ? "text-green-dark"
                      : "text-stone-800 hover:text-green-dark"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.08 }}
            >
              <Link
                href={bookNowLink}
                onClick={() => setMobileOpen(false)}
                className="px-8 py-3 bg-green-dark text-white font-sans text-sm tracking-widest uppercase"
              >
                {bookNowText}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
