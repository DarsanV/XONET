import { LayoutDashboard, Compass, Briefcase, Users, UserCircle, FolderKanban } from "lucide-react";
export const navGroups = [
    {
        label: "Overview",
        items: [
            { title: "Dashboard", href: "/", icon: LayoutDashboard },
        ]
    },
    {
        label: "Work",
        items: [
            { title: "Explore Tasks", href: "/explore", icon: Compass },
            { title: "Tasks", href: "/tasks", icon: FolderKanban },
            { title: "My Works", href: "/my-works", icon: Briefcase },
        ]
    },
    {
        label: "Network",
        items: [
            { title: "Freelancers", href: "/freelancers", icon: Users },
        ]
    },
    {
        label: "Settings",
        items: [
            { title: "Profile", href: "/account", icon: UserCircle },
        ]
    }
];
export function isNavActive(pathname, href) {
    if (href === "/")
        return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}
