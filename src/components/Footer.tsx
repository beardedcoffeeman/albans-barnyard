import Link from "next/link";

const footerLinks = {
  Stay: [
    { href: "/cox-cottage", label: "Cox Cottage" },
    { href: "/cox-cottage#booking", label: "Book Your Stay" },
    { href: "/cox-cottage#amenities", label: "Amenities" },
    { href: "/cox-cottage#faq", label: "FAQ" },
  ],
  Explore: [
    { href: "/the-farm", label: "The Farm" },
    { href: "/lambcam", label: "Lambcam" },
    { href: "/farm-shop", label: "Farm Shop" },
  ],
  Connect: [
    { href: "/contact", label: "Contact Us" },
    { href: "https://www.facebook.com/albansbarnyard", label: "Facebook" },
    { href: "https://www.instagram.com/albansbarnyard", label: "Instagram" },
  ],
};

export function Footer() {
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
              A Weald of Kent cottage on a working farm, just five miles
              from Tunbridge Wells. One of the finest places to stay in Kent.
            </p>
            <div className="mt-6 text-sm text-white/40">
              <p>Romford Road, Pembury</p>
              <p>Kent, TN2 4BB</p>
              <p className="mt-2">+44 (0)1892 826052</p>
              <p>mail@albansbarnyard.co.uk</p>
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
            &copy; 2026 Albans Barnyard. All rights reserved.
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
