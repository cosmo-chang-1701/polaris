"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Form extends React.HTMLAttributes<HTMLDivElement> {}
type FormState = {
  [key: string]: {
    title: string;
    description: string;
    buttonText: string;
  };
};

const formStateMapping: FormState = {
  signin: {
    title: "Welcome",
    description: "Please signin to continue",
    buttonText: "Signin"
  },
  signup: {
    title: "Create an account",
    description: "Enter your email and password below to create your account",
    buttonText: "Create account"
  }
};

export function Form({ action }: { action: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formProperties = formStateMapping[action];

  function handleClick() {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{formProperties.title}</CardTitle>
        <CardDescription>{formProperties.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" disabled={isLoading} />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={isLoading} onClick={handleClick}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {formProperties.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
