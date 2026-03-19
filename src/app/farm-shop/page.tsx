import type { Metadata } from "next";
import { FarmShopPage } from "./FarmShopPage";

export const metadata: Metadata = {
  title: "Farm Shop",
  description:
    "Shop artisan farm produce from Alban's Barnyard - Jacob sheepskin rugs, pure honey, rare breed meat boxes, and handmade cushions.",
};

export default function FarmShop() {
  return <FarmShopPage />;
}
