
// src/app/admin/layout.tsx
'use client';

import type { Metadata } from 'next'; // Metadata type can still be used for static parts
import Link from 'next/link';
import { Shield, Settings, User, BookOpen, Link2, LayoutDashboard, PenTool, LogOut } from 'lucide-react';
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/authUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// export const metadata: Metadata = { // Keep static metadata for crawlers if login page is public
//   title: 'Admin Panel - Hembram',
//   description: 'Manage your author website content.',
// };

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/author-bio', label: 'Author Bio', icon: User },
  { href: '/admin/books', label: 'Books', icon: BookOpen },
  { href: '/admin/social-links', label: 'Social Links', icon: Link2 },
  { href: '/admin/currently-crafting', label: 'Currently Crafting', icon: PenTool },
];

function AdminContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsLoading(false);

      if (!authenticated && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else if (authenticated && pathname === '/admin/login') {
        router.replace('/admin');
      }
    };

    checkAuth(); // Initial check

    // Listen for auth changes (e.g., after login/logout)
    window.addEventListener('adminAuthChanged', checkAuth);
    return () => {
      window.removeEventListener('adminAuthChanged', checkAuth);
    };
  }, [pathname, router]);
  
  useEffect(() => {
    // Set document title dynamically based on auth state
    if (typeof document !== 'undefined') {
      if (pathname === '/admin/login' && !isAuth) {
        document.title = 'Admin Login - Hembram';
      } else if (isAuth) {
        document.title = 'Admin Panel - Hembram';
      }
      // Potentially add more specific titles for other admin pages if needed
    }
  }, [pathname, isAuth]);


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader><CardTitle className="text-center">Loading Admin Area...</CardTitle></CardHeader>
          <CardContent><p className="text-center text-muted-foreground">Please wait...</p></CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuth && pathname !== '/admin/login') {
    // Still loading or redirecting, show minimal content or null
    // This case should be covered by the redirect in useEffect,
    // but as a fallback, prevent rendering admin UI if not authenticated.
    return null; 
  }
  
  if (!isAuth && pathname === '/admin/login') {
    // Render the login page (children will be the login page component)
    return <>{children}</>;
  }

  if (isAuth && pathname === '/admin/login') {
    // Authenticated user on login page, redirect handled by useEffect.
    // Render nothing here to avoid flicker, or a loading indicator.
     return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader><CardTitle className="text-center">Redirecting...</CardTitle></CardHeader>
        </Card>
      </div>
    );
  }


  // If authenticated and not on the login page, render the admin UI
  if (isAuth) {
    const handleLogout = () => {
      logout();
      router.replace('/admin/login');
    };

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
                  isActive={pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
           <SidebarFooter className="p-2">
             <Button variant="ghost" onClick={handleLogout} className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0">
                <LogOut className="mr-2 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Button>
           </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-0">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
            <SidebarTrigger className="md:hidden"/>
            <h1 className="text-xl font-semibold text-foreground">Admin Area</h1>
            <div className="ml-auto flex items-center gap-2">
               <Button variant="outline" asChild>
                  <Link href="/">View Site</Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
            {/* Removed developer note as auth is now (simulated) implemented */}
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  // Fallback for any unhandled state, though useEffect should manage redirects.
  // This could be a loading indicator or null if redirects are expected to handle it.
  return null;
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Using Suspense here in case child components have async operations
  // that could suspend during rendering. This is good practice.
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader><CardTitle className="text-center">Loading...</CardTitle></CardHeader>
        </Card>
      </div>
    }>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}
