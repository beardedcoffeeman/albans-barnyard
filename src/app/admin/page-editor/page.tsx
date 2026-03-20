import type { Metadata } from "next";
import { InlineEditor } from "./InlineEditor";

export const metadata: Metadata = {
  title: "Page Editor",
  robots: "noindex, nofollow",
};

export default function PageEditorPage() {
  return <InlineEditor />;
}
