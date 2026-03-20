import type { Metadata } from "next";
import { CottagePage } from "./CottagePage";

export const metadata: Metadata = {
  title: "Cox Cottage",
  description:
    "Book our self catering holiday cottage in Kent. Two ensuite bedrooms, wood burning stove, hand-built kitchen, and private garden on a working farm in the Weald.",
};

export default function CoxCottagePage() {
  return <CottagePage />;
}
