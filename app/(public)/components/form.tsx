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

import { useTranslation } from "@/app/i18n/client";

export function Form({
  params: { title, description, buttonText }
}: {
  params: {
    title: string;
    description: string;
    buttonText: string;
  };
}) {
  const { t } = useTranslation("account");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleClick() {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" disabled={isLoading} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={isLoading} onClick={handleClick}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
