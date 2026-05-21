import type { Metadata } from "next";
import { DashboardView } from "@/components/views";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your projects, earnings and AI-recommended work.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
