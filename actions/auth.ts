"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate({
  email,
  password
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", { email, password });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
