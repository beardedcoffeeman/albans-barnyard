import { dbGet, dbSet } from "./db";

export interface PageSection {
  id: string;
  page: string;
  label: string;
  fields: Record<string, string | string[] | boolean | number>;
}

export interface SiteContent {
  sections: PageSection[];
}

const defaultContent: SiteContent = {
  sections: [
    {
      id: "hero",
      page: "home",
      label: "Homepage Hero",
      fields: {
        image: "/images/farm/hero-banner.jpg",
        fallbackImage: "/images/farm/farm-view-1.jpg",
        eyebrow: "The Weald of Kent",
        title: "A Home",
        titleLine2: "from Home",
        subtitle: "Luxurious holiday accommodation on a working farm, nestled in the rolling countryside five miles from Tunbridge Wells.",
        cta1Text: "Explore the Cottage",
        cta1Link: "/cox-cottage",
        cta2Text: "Check Availability",
        cta2Link: "/cox-cottage#booking",
      },
    },
    {
      id: "about",
      page: "home",
      label: "About Section",
      fields: {
        eyebrow: "Our Story",
        title: "Where Countryside",
        titleLine2: "Meets Comfort",
        paragraph1: "Set in the heart of the Kentish Weald, Alban's Barnyard is a small working farm raising pedigree Jacob sheep and North Devon Red Ruby cattle among rolling orchards and ancient woodland.",
        paragraph2: "Cox Cottage has been lovingly designed with sustainability at its heart — powered by ground source heat pump, solar panels, and heat recovery ventilation — without compromising on luxury.",
        paragraph3: "Whether you're watching lambs in spring, tasting our own honey in summer, or curling up by the fire in winter, every season brings something special.",
        mainImage: "/images/farm/sunset-tractor.jpg",
        smallImage: "/images/cottage/interior-11.jpg",
        ctaText: "Discover the Farm",
        ctaLink: "/the-farm",
      },
    },
    {
      id: "seasonal",
      page: "home",
      label: "Seasonal Banner",
      fields: {
        enabled: true,
        autoSeason: true,
        season: "Spring 2026",
        title: "Lambing Season",
        titleLine2: "is Here",
        subtitle: "Watch our Jacob ewes and their lambs live on the Lambcam, or book a spring stay and experience it first-hand.",
        backgroundImage: "/images/farm/lambs-field.jpg",
        cta1Text: "Watch Live",
        cta1Link: "/lambcam",
        cta2Text: "Book a Spring Stay",
        cta2Link: "/cox-cottage#booking",
      },
    },
    {
      id: "lambcam",
      page: "home",
      label: "Lambcam Section",
      fields: {
        enabled: true,
        showInMenu: true,
        title: "Lambcam",
        description: "Watch our flock in real-time. During lambing season, you can witness the arrival of new lambs from the comfort of your screen.",
        camera1Alias: "620d2145dc98f",
        camera1Label: "Barn View",
        camera2Alias: "64135a44aacd3",
        camera2Label: "Pen View",
      },
    },
    {
      id: "cottage-intro",
      page: "cox-cottage",
      label: "Cox Cottage Introduction",
      fields: {
        heroImage: "/images/cottage/cottages-05.jpg",
        title: "Cox Cottage",
        description: "A beautifully restored barn conversion with two spacious ensuite bedrooms, an open-plan kitchen and living area with wood burning stove, and a private garden overlooking the farm.",
      },
    },
    {
      id: "contact",
      page: "contact",
      label: "Contact Details",
      fields: {
        phone: "+44 (0)1892 826052",
        email: "mail@albansbarnyard.co.uk",
        address: "Alban's Barnyard\nRomford Road\nPembury, Kent\nTN2 4BB",
      },
    },
  ],
};

export async function getContent(): Promise<SiteContent> {
  const content = await dbGet<SiteContent>("content", defaultContent);
  if (!content.sections || content.sections.length === 0) {
    await dbSet("content", defaultContent);
    return defaultContent;
  }
  return content;
}

export async function getSection(id: string): Promise<PageSection | undefined> {
  const content = await getContent();
  return content.sections.find((s) => s.id === id);
}

export async function updateSection(
  id: string,
  fields: Record<string, string | string[] | boolean | number>
): Promise<PageSection | null> {
  const content = await getContent();
  const section = content.sections.find((s) => s.id === id);
  if (!section) return null;
  section.fields = { ...section.fields, ...fields };
  await dbSet("content", content);
  return section;
}
