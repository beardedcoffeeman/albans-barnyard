import type { Metadata } from "next";
import { LambcamFullPage } from "./LambcamFullPage";
import { getSection } from "@/lib/contentStore";
import { getSettings } from "@/lib/settingsStore";

export const metadata: Metadata = {
  title: "Lambcam",
  description:
    "A live lambing experience from the comfort of your screen. Watch our Jacob sheep and lambs from the shed at Albans Barnyard in Kent, with two camera angles.",
};

export default async function LambcamPage() {
  const [settings, lambcamSection] = await Promise.all([
    getSettings(),
    getSection("lambcam"),
  ]);

  // Content store is the source of truth for lambcam toggles
  if (lambcamSection?.fields) {
    settings.lambcamEnabled = lambcamSection.fields.enabled !== false;
  }

  return (
    <LambcamFullPage
      settings={settings}
      content={lambcamSection?.fields ?? {}}
    />
  );
}
