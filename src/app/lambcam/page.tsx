import type { Metadata } from "next";
import { LambcamFullPage } from "./LambcamFullPage";

export const metadata: Metadata = {
  title: "Lambcam",
  description:
    "A live lambing experience from the comfort of your screen. Watch our Jacob sheep and lambs from the shed at Alban's Barnyard in Kent, with two camera angles.",
};

export default function LambcamPage() {
  return <LambcamFullPage />;
}
