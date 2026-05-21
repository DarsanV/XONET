import type { Metadata } from "next";
import { MyWorksView } from "@/components/views";

export const metadata: Metadata = {
  title: "My Works",
  description: "All your active, completed, and in-review projects.",
};

export default function MyWorksPage() {
  return <MyWorksView />;
}
