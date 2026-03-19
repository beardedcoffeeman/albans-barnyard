export interface SeasonConfig {
  name: string;
  label: string;
  bannerTitle: string;
  bannerTitleLine2: string;
  bannerSubtitle: string;
  bannerImage: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

export function getCurrentSeason(): SeasonConfig {
  const month = new Date().getMonth(); // 0-11

  // Spring: March-May (lambing season)
  if (month >= 2 && month <= 4) {
    return {
      name: "spring",
      label: `Spring ${new Date().getFullYear()}`,
      bannerTitle: "Lambing Season",
      bannerTitleLine2: "is Here",
      bannerSubtitle:
        "Watch our Jacob ewes and their lambs live on the Lambcam, or book a spring stay and experience it first-hand.",
      bannerImage: "/images/farm/lambs-field.jpg",
      cta1Text: "Watch the Lambcam",
      cta1Link: "/lambcam",
      cta2Text: "Book a Spring Stay",
      cta2Link: "/cox-cottage#booking",
    };
  }

  // Summer: June-August
  if (month >= 5 && month <= 7) {
    return {
      name: "summer",
      label: `Summer ${new Date().getFullYear()}`,
      bannerTitle: "Golden Days",
      bannerTitleLine2: "on the Farm",
      bannerSubtitle:
        "The honey harvest is in, the orchards are laden with fruit, and the meadows are alive with wildflowers. The perfect time for a countryside escape.",
      bannerImage: "/images/farm/sunset-tractor.jpg",
      cta1Text: "Explore the Farm",
      cta1Link: "/the-farm",
      cta2Text: "Book a Summer Stay",
      cta2Link: "/cox-cottage#booking",
    };
  }

  // Autumn: September-November
  if (month >= 8 && month <= 10) {
    return {
      name: "autumn",
      label: `Autumn ${new Date().getFullYear()}`,
      bannerTitle: "Harvest Season",
      bannerTitleLine2: "in Kent",
      bannerSubtitle:
        "The orchards glow with autumn colour, our rare breed meat boxes are ready, and the wood stove at Cox Cottage is waiting to welcome you.",
      bannerImage: "/images/farm/countryside.jpg",
      cta1Text: "Farm Shop",
      cta1Link: "/farm-shop",
      cta2Text: "Book an Autumn Escape",
      cta2Link: "/cox-cottage#booking",
    };
  }

  // Winter: December-February
  return {
    name: "winter",
    label: `Winter ${new Date().getFullYear()}`,
    bannerTitle: "A Cosy Retreat",
    bannerTitleLine2: "Awaits",
    bannerSubtitle:
      "Crisp walks through frosty fields, then curl up by the wood burner with a glass of something warm. Cox Cottage is the perfect winter hideaway.",
    bannerImage: "/images/farm/landscape-main.jpg",
    cta1Text: "View the Cottage",
    cta1Link: "/cox-cottage",
    cta2Text: "Book a Winter Break",
    cta2Link: "/cox-cottage#booking",
  };
}

export function getAllSeasons(): SeasonConfig[] {
  const year = new Date().getFullYear();
  return [
    { ...getCurrentSeasonByName("spring"), label: `Spring ${year}` },
    { ...getCurrentSeasonByName("summer"), label: `Summer ${year}` },
    { ...getCurrentSeasonByName("autumn"), label: `Autumn ${year}` },
    { ...getCurrentSeasonByName("winter"), label: `Winter ${year}` },
  ];
}

function getCurrentSeasonByName(name: string): SeasonConfig {
  const seasons: Record<string, SeasonConfig> = {
    spring: {
      name: "spring",
      label: "Spring",
      bannerTitle: "Lambing Season",
      bannerTitleLine2: "is Here",
      bannerSubtitle: "Watch our Jacob ewes and their lambs live on the Lambcam, or book a spring stay and experience it first-hand.",
      bannerImage: "/images/farm/lambs-field.jpg",
      cta1Text: "Watch the Lambcam",
      cta1Link: "/lambcam",
      cta2Text: "Book a Spring Stay",
      cta2Link: "/cox-cottage#booking",
    },
    summer: {
      name: "summer",
      label: "Summer",
      bannerTitle: "Golden Days",
      bannerTitleLine2: "on the Farm",
      bannerSubtitle: "The honey harvest is in, the orchards are laden with fruit, and the meadows are alive with wildflowers. The perfect time for a countryside escape.",
      bannerImage: "/images/farm/sunset-tractor.jpg",
      cta1Text: "Explore the Farm",
      cta1Link: "/the-farm",
      cta2Text: "Book a Summer Stay",
      cta2Link: "/cox-cottage#booking",
    },
    autumn: {
      name: "autumn",
      label: "Autumn",
      bannerTitle: "Harvest Season",
      bannerTitleLine2: "in Kent",
      bannerSubtitle: "The orchards glow with autumn colour, our rare breed meat boxes are ready, and the wood stove at Cox Cottage is waiting to welcome you.",
      bannerImage: "/images/farm/countryside.jpg",
      cta1Text: "Farm Shop",
      cta1Link: "/farm-shop",
      cta2Text: "Book an Autumn Escape",
      cta2Link: "/cox-cottage#booking",
    },
    winter: {
      name: "winter",
      label: "Winter",
      bannerTitle: "A Cosy Retreat",
      bannerTitleLine2: "Awaits",
      bannerSubtitle: "Crisp walks through frosty fields, then curl up by the wood burner with a glass of something warm. Cox Cottage is the perfect winter hideaway.",
      bannerImage: "/images/farm/landscape-main.jpg",
      cta1Text: "View the Cottage",
      cta1Link: "/cox-cottage",
      cta2Text: "Book a Winter Break",
      cta2Link: "/cox-cottage#booking",
    },
  };
  return seasons[name] || seasons.spring;
}
