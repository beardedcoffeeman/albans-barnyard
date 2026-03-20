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
        paragraph1: "Set in the heart of the Kentish Weald, Albans Barnyard is a small working farm raising pedigree Jacob sheep and North Devon Red Ruby cattle among rolling orchards and ancient woodland.",
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
      id: "cottage-preview",
      page: "home",
      label: "Cottage Preview (Homepage)",
      fields: {
        eyebrow: "The Accommodation",
        title: "Cox Cottage",
        feature1Label: "2 Bedrooms",
        feature1Detail: "King & double with ensuites",
        feature2Label: "Sleeps 4",
        feature2Detail: "Couples & families welcome",
        feature3Label: "Wood Stove",
        feature3Detail: "Cosy Charnwood burner",
        feature4Label: "Eco-Friendly",
        feature4Detail: "Ground source heat pump & solar",
        ctaText: "View Full Details",
      },
    },
    {
      id: "video",
      page: "home",
      label: "Video Section",
      fields: {
        eyebrow: "Watch",
        title: "Lambs at",
        titleLine2: "Play",
        description: "Our Jacob lambs enjoying spring sunshine on the farm. There's nothing quite like watching them chase each other across the fields, and guests at Cox Cottage can see it first-hand.",
        videoUrl: "https://player.vimeo.com/video/315014239?h=aff6d9dfa6&title=0&byline=0&portrait=0",
      },
    },
    {
      id: "products",
      page: "home",
      label: "Farm Shop Products",
      fields: {
        eyebrow: "From the Farm",
        title: "Farm Shop",
        product1Title: "Pure Honey",
        product1Description: "Raw, unblended honey from our own hives, harvested each summer from the wildflowers and orchards of the farm.",
        product2Title: "Sheepskins",
        product2Description: "Luxurious Jacob sheepskin rugs, tanned at the oldest tannery in the country using traditional methods.",
        product3Title: "Meat Boxes",
        product3Description: "Seasonal boxes of rare breed pork and lamb, raised slowly on natural pasture right here on the farm.",
      },
    },
    {
      id: "testimonials",
      page: "home",
      label: "Guest Testimonials",
      fields: {
        testimonial1Quote: "An absolutely beautiful cottage in a stunning setting. Watching the lambs from the garden was magical. We didn't want to leave.",
        testimonial1Author: "Sarah & James",
        testimonial1Date: "Spring 2025",
        testimonial2Quote: "The perfect winter retreat. The wood burner, underfloor heating, and gorgeous kitchen made it feel truly special.",
        testimonial2Author: "The Richardson Family",
        testimonial2Date: "Winter 2024",
        testimonial3Quote: "We've stayed twice now and it gets better every time. The attention to detail is extraordinary.",
        testimonial3Author: "Mark & Claire",
        testimonial3Date: "Summer 2024",
        testimonial4Quote: "A real gem hidden in the Kent countryside. The cottage is immaculate and the farm experience for our children was unforgettable.",
        testimonial4Author: "The Patels",
        testimonial4Date: "Easter 2024",
      },
    },
    {
      id: "cottage-intro",
      page: "cox-cottage",
      label: "Cox Cottage Introduction",
      fields: {
        heroImage: "/images/cottage/cottages-05.jpg",
        title: "Cox Cottage",
        description: "A beautifully restored holiday cottage in Kent with two spacious ensuite bedrooms, an open-plan kitchen and living area with wood burning stove, and a private garden overlooking the farm. Designed with sustainability and luxury in equal measure.",
      },
    },
    {
      id: "cottage-welcome",
      page: "cox-cottage",
      label: "Welcome Hamper",
      fields: {
        eyebrow: "A Warm Welcome",
        title: "The Little Touches",
        titleLine2: "That Matter",
        description: "Every stay begins with a welcome hamper of farm produce: freshly laid eggs, our own honey, homemade cake, and a selection of local treats. It's our way of saying welcome to the farm.",
        image: "/images/cottage/welcome-hamper.png",
      },
    },
    {
      id: "cottage-faq",
      page: "cox-cottage",
      label: "FAQ",
      fields: {
        faq1Q: "Are pets welcome?",
        faq1A: "We're sorry but we are unable to accommodate pets at Cox Cottage to keep it allergy-free for all guests.",
        faq2Q: "What day can we arrive?",
        faq2A: "Kent cottage holidays at Cox Cottage can start on any day of the week, subject to availability. Minimum stay is typically 2 nights.",
        faq3Q: "How close is the nearest restaurant?",
        faq3A: "The Poet at Matfield is a lovely gastropub just a 5-minute drive away. Tunbridge Wells has a wide range of restaurants 15 minutes away.",
        faq4Q: "Can we visit the farm animals?",
        faq4A: "Absolutely! Guests are welcome to walk around the farm, see the sheep and cattle, and during lambing season, enjoy a hands-on lamb feeding experience in the lambing shed.",
        faq5Q: "Can we order farm produce?",
        faq5A: "Yes, our honey, sheepskins and meat boxes can be ordered in advance of your stay or from our farm shop page.",
        faq6Q: "How far is London?",
        faq6A: "London is approximately one hour by car or train, making us one of the most accessible luxury farm stays near London. Tunbridge Wells station has regular services to London Bridge and Charing Cross.",
      },
    },
    {
      id: "farm-intro",
      page: "the-farm",
      label: "Farm Introduction",
      fields: {
        eyebrow: "Our Heritage",
        title: "Traditional Breeds,",
        titleLine2: "Modern Values",
        paragraph1: "Albans Barnyard is a small family farm nestled in the Kentish Weald, where we raise pedigree Jacob sheep and North Devon Red Ruby cattle using traditional, high-welfare methods.",
        paragraph2: "Our Jacob sheep are a beautiful four-horned British breed with distinctive spotted fleeces. The flock has been carefully bred over many years, producing characterful lambs that visitors fall in love with each spring.",
        paragraph3: "The North Devon Red Ruby cattle are one of Britain's oldest native breeds, known for their rich, well-marbled beef. They thrive on our natural pastures, supplemented only with our own hay and silage.",
      },
    },
    {
      id: "farm-seasons",
      page: "the-farm",
      label: "Four Seasons",
      fields: {
        springDescription: "Lambing season is the highlight of the year. Watch newborn lambs take their first steps, enjoy a lambing experience in the shed, and feel the farm coming alive after winter.",
        summerDescription: "The hives are buzzing, the orchards are heavy with fruit, and the cattle graze contentedly in lush pastures. Our honey harvest takes place in late summer.",
        autumnDescription: "The farm takes on golden hues as the orchards turn. It's tupping time for the sheep, and we prepare our seasonal meat boxes from our rare breed livestock.",
        winterDescription: "A magical time to visit. Crisp mornings, frosty fields, and the warmth of the wood burner waiting for you back at the cottage. The farm's robin is always a welcome visitor.",
      },
    },
    {
      id: "shop-products",
      page: "farm-shop",
      label: "Shop Products",
      fields: {
        intro: "Everything we sell comes directly from the farm, available to order online or collect during your cottage holiday in Kent. Our sheepskins are from our own Jacob flock, our honey from our own hives, and our meat from animals born and raised right here in the Kentish Weald.",
        sheepskinSinglePrice: "£95",
        sheepskinSingleDescription: "A luxurious Jacob sheepskin rug, each one unique with distinctive spotted markings. Tanned at the oldest tannery in the country using traditional methods.",
        sheepskinDoublePrice: "£200",
        sheepskinDoubleDescription: "Two matching sheepskins stitched together to create a generous rug, perfect as a throw or beside your bed.",
        honeyPrice: "From £8",
        honeyDescription: "Raw, unblended honey harvested from our hives each summer. The bees forage on wildflowers, clover, and orchard blossoms across the farm.",
        meatBoxPrice: "From £50",
        meatBoxDescription: "Seasonal boxes of rare breed pork and lamb, raised slowly on natural pasture. Our animals are born and reared on the farm with the highest welfare standards.",
      },
    },
    {
      id: "contact",
      page: "contact",
      label: "Contact Details",
      fields: {
        phone: "+44 (0)1892 826052",
        email: "mail@albansbarnyard.co.uk",
        address: "Albans Barnyard\nRomford Road\nPembury, Kent\nTN2 4BB",
        findingUs: "The easiest way to find us is to search for \"Albans Barnyard\" in Google Maps or Waze. We have a pin that will bring you straight to the farm gate. We'd recommend this over a postcode, as satnav systems have been known to send visitors somewhere else entirely!",
        directions: "From Matfield village on the B2160, find The Poet restaurant (postcode TN12 7JH) and turn into Chestnut Lane beside it. After 300 yards, turn left into Foxhole Lane. Follow the lane down into the valley, then bear right up the hill onto Romford Road. On the brow of the hill, turn right into the farm track marked \"Albans Farm and Springhill Trout Fishery.\" Follow the track to the very end and through some wooden gates into Albans Barnyard.",
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
