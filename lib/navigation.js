import { LayoutDashboard, Compass, Briefcase, Users, UserCircle, FolderKanban, MessageSquare, } from "lucide-react";
export const mainNavItems = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Explore Tasks", href: "/explore", icon: Compass },
    { title: "Tasks", href: "/tasks", icon: FolderKanban },
    { title: "My Works", href: "/my-works", icon: Briefcase },
    { title: "Messages", href: "/chat", icon: MessageSquare },
    { title: "Freelancers", href: "/freelancers", icon: Users },
    { title: "Profile", href: "/account", icon: UserCircle },
];
export function isNavActive(pathname, href) {
    if (href === "/")
        return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}
