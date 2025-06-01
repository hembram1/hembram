
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Settings, User, BookOpen, Link2 } from "lucide-react";
import Link from "next/link";

const adminSections = [
  { href: '/admin/settings', title: 'Site Settings', description: 'Manage header logo and site title.', icon: Settings },
  { href: '/admin/author-bio', title: 'Author Bio', description: 'Edit the author biography section.', icon: User },
  { href: '/admin/books', title: 'Books', description: 'Add, edit, or remove books and featured books.', icon: BookOpen },
  { href: '/admin/social-links', title: 'Social Links', description: 'Update contact and social media links.', icon: Link2 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Admin Dashboard</CardTitle>
          </div>
          <CardDescription className="text-md">
            Welcome to the Hembram author website admin panel. Select a section below to manage content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            From here, you will be able to manage various aspects of your website once the backend functionality is implemented.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section) => (
          <Link href={section.href} key={section.title} className="block hover:no-underline">
            <Card className="h-full hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <section.icon className="h-7 w-7 text-accent" />
                <CardTitle className="text-xl font-headline text-primary">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
