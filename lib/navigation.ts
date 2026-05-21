import {
  LayoutDashboard,
  Compass,
  Briefcase,
  Users,
  UserCircle,
  FolderKanban,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Explore Tasks", href: "/explore", icon: Compass },
  { title: "Tasks", href: "/tasks", icon: FolderKanban },
  { title: "My Works", href: "/my-works", icon: Briefcase },
  { title: "Freelancers", href: "/freelancers", icon: Users },
  { title: "Profile", href: "/account", icon: UserCircle },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
