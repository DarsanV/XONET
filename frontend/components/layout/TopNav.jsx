"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Search, User, Settings, LogOut, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useProfileStore } from "@/lib/profile-store";
import { apiFetchPublic } from "@/lib/api-client";

async function handleLogout() {
    const session = await import("next-auth/react").then((m) => m.getSession());
    try {
        if (session?.refreshToken) {
            await apiFetchPublic("/api/auth/logout", {
                method: "POST",
                body: JSON.stringify({ refreshToken: session.refreshToken }),
                credentials: "include",
            });
        }
    } catch {
        // proceed with client sign-out even if API logout fails
    }
    await signOut({ callbackUrl: "/login" });
}

export function TopNav() {
    const { profile } = useProfileStore();
    return (<header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="md:hidden"/>
      <Link href="/" className="flex items-center gap-2 pr-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-foreground text-background">
          <span className="text-[13px] font-bold">X</span>
        </div>
        <span className="hidden text-[15px] font-semibold tracking-[0.2em] sm:inline">XONET</span>
      </Link>

      <div className="mx-auto w-full max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
          <Input placeholder="Search projects, clients, skills…" className="h-10 rounded-md border-border bg-card pl-9 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-ring"/>
        </div>
      </div>

      <NotificationBell />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-border bg-card hover:bg-secondary">
            <User className="h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-border bg-card">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{profile.fullName}</span>
              <span className="text-xs text-muted-foreground">{profile.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              <UserCircle2 className="mr-2 h-4 w-4"/> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4"/> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4"/> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>);
}
