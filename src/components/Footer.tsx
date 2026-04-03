import Link from "next/link";
import type { SiteSettings } from "@/lib/settingsStore";

interface FooterProps {
  settings: SiteSettings;
  content?: Record<string, string | string[] | boolean | number>;
}

export function Footer({ settings, content }: FooterProps) {
  const stayLinks = [
    { href: "/cox-cottage", label: String(content?.cottageLabel ?? "Cox Cottage") },
    { href: "/cox-cottage#booking", label: String(content?.bookLabel ?? "Book Your Stay") },
    { href: "/cox-cottage#amenities", label: String(content?.amenitiesLabel ?? "Amenities") },
    { href: "/cox-cottage#faq", label: String(content?.faqLabel ?? "FAQ") },
  ];

  const exploreLinks = [
    { href: "/the-farm", label: String(content?.farmLabel ?? "The Farm") },
    { href: "/lambcam", label: String(content?.lambcamLabel ?? "Lambcam") },
    { href: "/farm-shop", label: String(content?.shopLabel ?? "Farm Shop") },
  ].filter((link) => link.href !== "/lambcam" || settings.lambcamMenuVisible);

  const connectLinks = [
    { href: "/contact", label: String(content?.contactLabel ?? "Contact Us") },
    { href: "https://www.facebook.com/albansbarnyard", label: String(content?.facebookLabel ?? "Facebook") },
    { href: "https://www.instagram.com/albansbarnyard", label: String(content?.instagramLabel ?? "Instagram") },
  ];

  const footerLinks: Record<string, { href: string; label: string }[]> = {
    [String(content?.stayColumnTitle ?? "Stay")]: stayLinks,
    [String(content?.exploreColumnTitle ?? "Explore")]: exploreLinks,
    [String(content?.connectColumnTitle ?? "Connect")]: connectLinks,
  };

  const description = String(content?.description ?? "A Weald of Kent cottage on a working farm, just five miles from Tunbridge Wells. One of the finest places to stay in Kent.");
  const address = String(content?.address ?? "Romford Road, Pembury\nKent, TN2 4BB");
  const phone = String(content?.phone ?? "+44 (0)1892 826052");
  const email = String(content?.email ?? "mail@albansbarnyard.co.uk");
  const copyright = String(content?.copyright ?? "\u00a9 2026 Albans Barnyard. All rights reserved.");

  return (
    <footer className="bg-green-dark text-white/80">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl text-white mb-4">
              Albans Barnyard
            </h3>
            <p className="text-sm leading-relaxed text-white/60">
              {description}
            </p>
            <div className="mt-6 text-sm text-white/40">
              {address.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              <p className="mt-2">{phone}</p>
              <p>{email}</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-gold mb-6">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            {copyright}
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
