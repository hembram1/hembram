
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2 } from "lucide-react";

export default function AdminSocialLinksPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link2 className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Social Links</CardTitle>
        </div>
        <CardDescription className="text-md">
          Update social media links and contact information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This section will allow you to manage the social media links displayed on your website (e.g., Twitter, Instagram, Facebook) and potentially other contact details.
          Currently, these links are stored in <code className="bg-muted px-1 rounded">src/lib/constants.ts</code>.
        </p>
        {/* Placeholder for form elements to manage social links (platform, URL) */}
      </CardContent>
    </Card>
  );
}
