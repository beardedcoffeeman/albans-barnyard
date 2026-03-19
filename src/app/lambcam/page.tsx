import type { Metadata } from "next";
import { LambcamFullPage } from "./LambcamFullPage";

export const metadata: Metadata = {
  title: "Lambcam",
  description:
    "Watch our Jacob sheep and lambs live from the lambing shed at Alban's Barnyard in Kent. Two camera angles available during lambing season.",
};

export default function LambcamPage() {
  return <LambcamFullPage />;
}
