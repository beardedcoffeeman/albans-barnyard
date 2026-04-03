import type { Metadata } from "next";
import { CottagePage } from "./CottagePage";
import { getContent } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cox Cottage",
  description:
    "Book our self catering holiday cottage in Kent. Two ensuite bedrooms, wood burning stove, hand-built kitchen, and private garden on a working farm in the Weald.",
};

export default async function CoxCottagePage() {
  const content = await getContent();
  const section = (id: string) =>
    content.sections.find((s) => s.id === id)?.fields ?? {};

  return (
    <CottagePage
      intro={section("cottage-intro")}
      welcome={section("cottage-welcome")}
      faq={section("cottage-faq")}
      amenities={section("cottage-amenities")}
      sustainability={section("cottage-sustainability")}
    />
  );
}
