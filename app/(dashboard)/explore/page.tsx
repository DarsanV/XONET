import type { Metadata } from "next";
import { ExploreView } from "@/components/views";

export const metadata: Metadata = {
  title: "Explore Tasks",
  description: "Discover new projects matched to your skills.",
};

export default function ExplorePage() {
  return <ExploreView />;
}
