import { dbGet, dbSet } from "./db";

export interface SiteSettings {
  lambcamEnabled: boolean;
  lambcamMenuVisible: boolean;
  seasonalBannerTitle: string;
  seasonalBannerSubtitle: string;
  seasonalBannerSeason: string;
}

const defaults: SiteSettings = {
  lambcamEnabled: true,
  lambcamMenuVisible: true,
  seasonalBannerTitle: "Lambing Season is Here",
  seasonalBannerSubtitle: "Watch our Jacob ewes and their lambs live on the Lambcam.",
  seasonalBannerSeason: "Spring 2026",
};

export async function getSettings(): Promise<SiteSettings> {
  return dbGet<SiteSettings>("settings", defaults);
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  await dbSet("settings", updated);
  return updated;
}
