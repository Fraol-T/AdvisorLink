"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, FileText, Users, Award, Edit3, Search, LogOut, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";


const mainNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/workspace", label: "Workspace", icon: Users },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/documents", label: "Documents", icon: FileText },
];

const studentNavLinks = [
  { href: "/submit-title", label: "Submit Title", icon: Edit3 },
];

const facultyNavLinks = [
  { href: "/advisor-suggestion", label: "Advisor Suggestion", icon: Search },
  { href: "/submissions", label: "Submissions", icon: Award },
];

const helpNavLinks = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
];


export function NavLinks() {
  const pathname = usePathname();

  const renderLink = (link: { href: string; label: string; icon: React.ElementType }, index: number) => (
    <SidebarMenuItem key={`${link.label}-${index}`}>
      <Link href={link.href}>
        <SidebarMenuButton
          isActive={pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))}
          tooltip={{ children: link.label, className: "font-body" }}
          className="font-body"
        >
          <link.icon />
          <span className="truncate">{link.label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  return (
    <SidebarMenu>
      {mainNavLinks.map(renderLink)}
      
      {/* Assuming a simple role switch for demo, in real app this would be based on user role */}
      <SidebarMenuItem className="mt-2 mb-1">
         <p className="px-2 text-xs font-medium text-muted-foreground font-headline">Student Tools</p>
      </SidebarMenuItem>
      {studentNavLinks.map(renderLink)}

      <SidebarMenuItem className="mt-2 mb-1">
        <p className="px-2 text-xs font-medium text-muted-foreground font-headline">Faculty Tools</p>
      </SidebarMenuItem>
      {facultyNavLinks.map(renderLink)}
    </SidebarMenu>
  );
}

export function HelpNavLinks() {
  const pathname = usePathname();
  const renderLink = (link: { href: string; label: string; icon: React.ElementType }, index: number) => (
    <SidebarMenuItem key={`${link.label}-${index}`}>
      <Link href={link.href}>
        <SidebarMenuButton
          isActive={pathname === link.href}
          tooltip={{ children: link.label, className: "font-body" }}
          className="font-body"
        >
          <link.icon />
          <span className="truncate">{link.label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
  return (
     <SidebarMenu>
        {helpNavLinks.map(renderLink)}
        <SidebarMenuItem>
            <Button variant="ghost" className="w-full justify-start font-body text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                <LogOut className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" /> 
                <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
            </Button>
        </SidebarMenuItem>
     </SidebarMenu>
  );
}
