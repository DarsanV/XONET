import type { Metadata } from "next";
import { CreateTaskView } from "@/components/views";

export const metadata: Metadata = {
  title: "Create Task",
  description: "Post a new freelance project for qualified talent.",
};

export default function CreateTaskPage() {
  return <CreateTaskView />;
}
