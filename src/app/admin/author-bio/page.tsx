
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function AdminAuthorBioPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Author Bio</CardTitle>
        </div>
        <CardDescription className="text-md">
          Edit the author biography and profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This section will allow you to update the author's name, bio, image, and other profile details.
          Currently, this information is stored in <code className="bg-muted px-1 rounded">src/lib/constants.ts</code>.
        </p>
        {/* Placeholder for form elements: textarea for bio, input for name, image uploader etc. */}
      </CardContent>
    </Card>
  );
}
