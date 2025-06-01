
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Settings, User, BookOpen, Link2, LayoutDashboard } from 'lucide-react';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'; // Assuming you have a Sidebar component
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Admin Panel - Hembram',
  description: 'Manage your author website content.',
};

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/author-bio', label: 'Author Bio', icon: User },
  { href: '/admin/books', label: 'Books', icon: BookOpen },
  { href: '/admin/social-links', label: 'Social Links', icon: Link2 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="h-full" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/admin" className="flex items-center gap-2 group">
            <Shield className="h-7 w-7 text-primary group-data-[collapsible=icon]:mx-auto" />
            <span className="text-xl font-headline font-semibold text-primary group-data-[collapsible=icon]:hidden">Admin Panel</span>
          </Link>
        </SidebarHeader>
        <SidebarMenu className="flex-1 p-2">
          {adminNavLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                tooltip={{ children: link.label, className:"group-data-[collapsible=icon]:block hidden" }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </Sidebar>
      <SidebarInset className="p-0">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <SidebarTrigger className="md:hidden"/>
          <h1 className="text-xl font-semibold text-foreground">Admin Area</h1>
          <div className="ml-auto">
            <Button variant="outline" asChild>
                <Link href="/">View Site</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
          <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm">
            <p className="font-semibold">Developer Note:</p>
            <p>This is a basic admin panel structure. To make it fully functional, you'll need to:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Set up a database (e.g., Firestore, Supabase) to store your content.</li>
              <li>Implement an authentication system to protect this admin area.</li>
              <li>Create API endpoints or Server Actions to connect the admin UI to your database.</li>
              <li>Build out the forms and logic for creating, reading, updating, and deleting content.</li>
            </ul>
            <p className="mt-2">Currently, all website data is managed in <code className="bg-yellow-200 px-1 rounded">src/lib/constants.ts</code>.</p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
