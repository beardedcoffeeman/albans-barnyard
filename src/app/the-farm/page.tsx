import type { Metadata } from "next";
import { FarmPage } from "./FarmPage";
import { getContent } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Farm",
  description:
    "Discover a farm stay in Kent at Albans Barnyard. Pedigree Jacob sheep, North Devon Red Ruby cattle, and seasonal lambing experiences in the Weald of Kent.",
};

export default async function TheFarmPage() {
  const content = await getContent();
  const section = (id: string) =>
    content.sections.find((s) => s.id === id)?.fields ?? {};

  return (
    <FarmPage
      intro={section("farm-intro")}
      seasons={section("farm-seasons")}
    />
  );
}
