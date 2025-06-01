
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle } from "lucide-react";

export default function AdminBooksPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-headline">Manage Books</CardTitle>
            </div>
            <Button disabled> {/* Disabled until backend is implemented */}
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Book
            </Button>
          </div>
          <CardDescription className="text-md">
            Add, edit, or delete books. Manage which books are featured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            A list of your current books will appear here, allowing you to edit or delete them. You'll also be able to select which books are featured on the homepage.
            Currently, book data is stored in <code className="bg-muted px-1 rounded">src/lib/constants.ts</code>.
          </p>
          {/* Placeholder for book list table */}
          <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground">
            Book list and management tools will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
