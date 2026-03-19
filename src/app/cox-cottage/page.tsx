import type { Metadata } from "next";
import { CottagePage } from "./CottagePage";

export const metadata: Metadata = {
  title: "Cox Cottage",
  description:
    "A beautifully restored luxury holiday cottage with two ensuite bedrooms, wood burning stove, hand-built kitchen, and private garden on a working farm in Kent.",
};

export default function CoxCottagePage() {
  return <CottagePage />;
}
