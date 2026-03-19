import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const SETTINGS_FILE = join(process.cwd(), "data", "settings.json");

export interface SiteSettings {
  lambcamEnabled: boolean;
  lambcamMenuVisible: boolean;
  seasonalBannerTitle: string;
  seasonalBannerSubtitle: string;
  seasonalBannerSeason: string;
  seasonalBannerCta1Text: string;
  seasonalBannerCta1Link: string;
  seasonalBannerCta2Text: string;
  seasonalBannerCta2Link: string;
}

const defaults: SiteSettings = {
  lambcamEnabled: true,
  lambcamMenuVisible: true,
  seasonalBannerTitle: "Lambing Season is Here",
  seasonalBannerSubtitle: "Watch our Jacob ewes and their lambs live on the Lambcam, or book a spring stay and experience it first-hand.",
  seasonalBannerSeason: "Spring 2026",
  seasonalBannerCta1Text: "Watch Live",
  seasonalBannerCta1Link: "/lambcam",
  seasonalBannerCta2Text: "Book a Spring Stay",
  seasonalBannerCta2Link: "/cox-cottage#booking",
};

export function getSettings(): SiteSettings {
  if (!existsSync(SETTINGS_FILE)) return defaults;
  try {
    return { ...defaults, ...JSON.parse(readFileSync(SETTINGS_FILE, "utf-8")) };
  } catch {
    return defaults;
  }
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated = { ...current, ...updates };
  writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}
