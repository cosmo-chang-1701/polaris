"use server";

import { signIn, signUp } from "@/auth";
import { AuthError } from "next-auth";

import { getTranslation } from "@/app/i18n";

export async function authenticate(formData: {
  email: string;
  password: string;
}) {
  const { t } = await getTranslation("user-auth-form");

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return t("credentialsInvalid");
        default:
          return t("credentialsUnknownError");
      }
    }
    throw error;
  }
}

export async function createUser(formData: {
  email: string;
  password: string;
}) {
  try {
    await signUp(formData);
    await signIn("credentials", formData);
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
