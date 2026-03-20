import type { Metadata } from "next";
import { ContactPage } from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Albans Barnyard, one of the most special places to stay in Kent. Enquire about booking Cox Cottage or ordering farm produce.",
};

export default function Contact() {
  return <ContactPage />;
}
