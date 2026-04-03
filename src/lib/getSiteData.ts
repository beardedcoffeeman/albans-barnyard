import { getContent, getSection } from "./contentStore";
import { getSettings } from "./settingsStore";
import type { SiteSettings } from "./settingsStore";
import type { PageSection, SiteContent } from "./contentStore";

export type ContentFields = Record<string, string | string[] | boolean | number>;

export async function getSiteData() {
  const [content, settings] = await Promise.all([
    getContent(),
    getSettings(),
  ]);
  return { content, settings };
}

export async function getPageSections(page: string): Promise<PageSection[]> {
  const content = await getContent();
  return content.sections.filter((s) => s.page === page || s.page === "global");
}

export { getSettings, getSection, getContent };
export type { SiteSettings, PageSection, SiteContent };
