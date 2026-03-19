import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { CottagePreview } from "@/components/CottagePreview";
import { LambcamPreview } from "@/components/LambcamPreview";
import { SeasonalBanner } from "@/components/SeasonalBanner";
import { ProductsSection } from "@/components/ProductsSection";
import { GuestBookSection } from "@/components/GuestBookSection";
import { FacebookSection } from "@/components/FacebookSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <CottagePreview />
      <LambcamPreview />
      <SeasonalBanner />
      <ProductsSection />
      <GuestBookSection />
      <FacebookSection />
    </>
  );
}
