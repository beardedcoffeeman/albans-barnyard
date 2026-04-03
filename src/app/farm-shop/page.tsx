import type { Metadata } from "next";
import { FarmShopPage } from "./FarmShopPage";
import { getSection } from "@/lib/contentStore";

export const metadata: Metadata = {
  title: "Farm Shop",
  description:
    "Artisan produce from our Kent farm. Jacob sheepskin rugs, pure honey, and rare breed meat boxes, available to order or collect during your cottage holiday.",
};

export default async function FarmShop() {
  const shopContent = await getSection("shop-products");
  return <FarmShopPage content={shopContent?.fields ?? {}} />;
}
