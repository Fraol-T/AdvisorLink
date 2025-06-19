import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { NavLinks, HelpNavLinks } from '@/components/nav-links';
import { UserNav } from '@/components/user-nav';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center justify-between p-2 group-data-[collapsible=icon]:justify-center">
            <Logo className="group-data-[collapsible=icon]:hidden" />
            <SidebarTrigger className="md:hidden" />
          </div>
        </SidebarHeader>
        <ScrollArea className="flex-grow">
          <SidebarContent>
            <NavLinks />
          </SidebarContent>
        </ScrollArea>
        <SidebarFooter className="mt-auto border-t border-sidebar-border">
          <HelpNavLinks/>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:justify-end">
          <SidebarTrigger className="hidden md:group-data-[state=collapsed]/sidebar-wrapper:group-data-[collapsible=icon]/sidebar-wrapper:flex" />
          <UserNav />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-