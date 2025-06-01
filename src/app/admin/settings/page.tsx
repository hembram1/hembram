
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Site Settings</CardTitle>
        </div>
        <CardDescription className="text-md">
          Manage global site settings like the header title/logo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This section will contain forms to update your site's title, logo, and other global configurations.
          Currently, these are managed in your application code (e.g., Navbar component, layout files).
        </p>
        {/* Placeholder for form elements */}
      </CardContent>
    </Card>
  );
}
