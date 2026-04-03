import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import Script from "next/script";
import { getSettings } from "@/lib/settingsStore";
import { getSection } from "@/lib/contentStore";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Albans Barnyard | Luxury Farm Stay in the Weald of Kent",
    template: "%s | Albans Barnyard",
  },
  description:
    "One of the finest luxury farm stays near London. Cox Cottage is a beautifully restored holiday cottage in Kent on a working farm with artisan produce.",
  keywords: [
    "luxury farm stay Kent",
    "holiday cottage Tunbridge Wells",
    "Cox Cottage Pembury",
    "farm holiday accommodation",
    "lambing experience Kent",
    "Weald of Kent cottage",
    "self catering cottage Kent",
    "romantic cottage break Kent",
    "farm stay with animals",
    "cottage near Tunbridge Wells",
  ],
  authors: [{ name: "Albans Barnyard" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Albans Barnyard",
    title: "Albans Barnyard | Luxury Farm Stay in Kent",
    description:
      "Escape to Cox Cottage on a working farm in the Weald of Kent. Two ensuite bedrooms, wood burning stove, and Jacob sheep on the doorstep.",
    images: [
      {
        url: "/images/cottage/cottages-05.jpg",
        width: 1200,
        height: 800,
        alt: "Cox Cottage at Albans Barnyard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Albans Barnyard | Luxury Farm Stay in Kent",
    description:
      "Escape to Cox Cottage on a working farm in the Weald of Kent.",
    images: ["/images/cottage/cottages-05.jpg"],
  },
  metadataBase: new URL("https://albansbarnyard.co.uk"),
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Albans Barnyard - Cox Cottage",
  description:
    "Luxury self-catering holiday cottage on a working farm in Pembury, Kent. Two ensuite bedrooms, wood burning stove, hand-built kitchen.",
  url: "https://albansbarnyard.co.uk",
  telephone: "+441892826052",
  email: "mail@albansbarnyard.co.uk",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Romford Road",
    addressLocality: "Pembury",
    addressRegion: "Kent",
    postalCode: "TN2 4BB",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.1345,
    longitude: 0.3585,
  },
  image: "https://albansbarnyard.co.uk/images/cottage/cottages-05.jpg",
  priceRange: "££",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Garden", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wood Burning Stove", value: true },
  ],
  numberOfRooms: 2,
  petsAllowed: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, navSection, footerSection, lambcamSection] = await Promise.all([
    getSettings(),
    getSection("navigation"),
    getSection("footer"),
    getSection("lambcam"),
  ]);

  // Content store is the source of truth for lambcam toggles
  if (lambcamSection?.fields) {
    settings.lambcamEnabled = lambcamSection.fields.enabled !== false;
    settings.lambcamMenuVisible = lambcamSection.fields.showInMenu !== false;
  }

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AnalyticsTracker />
        <Navigation settings={settings} content={navSection?.fields} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} content={footerSection?.fields} />
      </body>
    </html>
  );
}
