import type { Metadata } from "next";
import { FarmPage } from "./FarmPage";

export const metadata: Metadata = {
  title: "The Farm",
  description:
    "Discover life at Alban's Barnyard - a working farm in the Weald of Kent raising pedigree Jacob sheep and North Devon Red Ruby cattle.",
};

export default function TheFarmPage() {
  return <FarmPage />;
}
