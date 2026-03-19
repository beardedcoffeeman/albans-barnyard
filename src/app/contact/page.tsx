import type { Metadata } from "next";
import { ContactPage } from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Alban's Barnyard. Enquire about booking Cox Cottage, ordering farm produce, or visiting the farm.",
};

export default function Contact() {
  return <ContactPage />;
}
