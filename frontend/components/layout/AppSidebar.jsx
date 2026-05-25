"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";
import { isNavActive, navGroups } from "@/lib/navigation";
export function AppSidebar() {
    const pathname = usePathname();
    return (<Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-6">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  return (<SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active} className="h-10 rounded-md data-[active=true]:bg-secondary data-[active=true]:text-foreground hover:bg-secondary/60">
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75}/>
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>);
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>);
}
