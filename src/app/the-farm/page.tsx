import type { Metadata } from "next";
import { FarmPage } from "./FarmPage";

export const metadata: Metadata = {
  title: "The Farm",
  description:
    "Discover a farm stay in Kent at Alban's Barnyard. Pedigree Jacob sheep, North Devon Red Ruby cattle, and seasonal lambing experiences in the Weald of Kent.",
};

export default function TheFarmPage() {
  return <FarmPage />;
}
