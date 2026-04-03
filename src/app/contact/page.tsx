import type { Metadata } from "next";
import { ContactPage } from "./ContactPage";
import { getSection } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Albans Barnyard, one of the most special places to stay in Kent. Enquire about booking Cox Cottage or ordering farm produce.",
};

export default async function Contact() {
  const contactSection = await getSection("contact");
  return <ContactPage content={contactSection?.fields ?? {}} />;
}
