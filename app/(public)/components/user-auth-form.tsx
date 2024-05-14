"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@/lib/zod-i18n";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/app/i18n/client";

import { authenticate, createUser } from "@/actions/auth";
import { useFormAction } from "@/hooks/useFormActions";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16)
});

export type UseFormActionFormSchema = z.infer<typeof formSchema>;

export default function UserAuthForm({
  children,
  params: { action, title, description, buttonText }
}: {
  children: React.ReactNode;
  params: {
    action: string;
    title: string;
    description: string;
    buttonText: string;
  };
}) {
  const { t } = useTranslation("user-auth-form");
  const { toast } = useToast();

  const form = useFormAction<UseFormActionFormSchema>({
    schema: formSchema,
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = async (formData: UseFormActionFormSchema) => {
    const validateError = Object.is(action, "login")
      ? await authenticate(formData)
      : await createUser(formData);
    toast({
      description: validateError
    });
  };

  return (
    <Card className="w-[400px]">
      <Form {...form}>
        <form
          className="space-y-8"
          action={() => form.handleAction(handleSubmit)}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@polaris.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {children}
          </CardContent>
          <CardFooter>
            <AuthButton text={buttonText} />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function AuthButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" aria-disabled={pending}>
      {text}
    </Button>
  );
}
