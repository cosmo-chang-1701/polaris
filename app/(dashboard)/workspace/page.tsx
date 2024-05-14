import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default async function Page() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-8">
      <Link href="/app/1">
        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>Chat assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A basic chatbot template for conversational dialogue.
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
