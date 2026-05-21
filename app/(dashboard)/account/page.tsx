import type { Metadata } from "next";
import { AccountView } from "@/components/views";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile, resume and professional links.",
};

export default function AccountPage() {
  return <AccountView />;
}
