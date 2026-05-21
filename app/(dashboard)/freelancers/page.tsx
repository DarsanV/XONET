import type { Metadata } from "next";
import { FreelancersView } from "@/components/views";

export const metadata: Metadata = {
  title: "Freelancers",
  description: "Browse vetted freelancers matched to your projects.",
};

export default function FreelancersPage() {
  return <FreelancersView />;
}
