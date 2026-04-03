import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { CottagePreview } from "@/components/CottagePreview";
import { LambcamPreview } from "@/components/LambcamPreview";
import { VideoSection } from "@/components/VideoSection";
import { SeasonalBanner } from "@/components/SeasonalBanner";
import { ProductsSection } from "@/components/ProductsSection";
import { GuestBookSection } from "@/components/GuestBookSection";
import { FacebookSection } from "@/components/FacebookSection";
import { getContent } from "@/lib/contentStore";
import { getSettings } from "@/lib/settingsStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, settings] = await Promise.all([
    getContent(),
    getSettings(),
  ]);

  const section = (id: string) =>
    content.sections.find((s) => s.id === id)?.fields ?? {};

  // Content store is the source of truth for lambcam toggles
  const lambcamFields = section("lambcam");
  settings.lambcamEnabled = lambcamFields.enabled !== false;
  settings.lambcamMenuVisible = lambcamFields.showInMenu !== false;

  return (
    <>
      <Hero content={section("hero")} />
      <AboutSection content={section("about")} />
      <CottagePreview content={section("cottage-preview")} />
      <VideoSection content={section("video")} />
      {settings.lambcamEnabled && (
        <LambcamPreview content={section("lambcam")} />
      )}
      <SeasonalBanner content={section("seasonal")} settings={settings} />
      <ProductsSection content={section("products")} />
      <GuestBookSection
        content={section("guest-book")}
        testimonials={section("testimonials")}
      />
      <FacebookSection />
    </>
  );
}
