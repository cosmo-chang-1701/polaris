import dynamic from "next/dynamic";
import Link from "next/link";

import { getTranslation } from "@/app/i18n";

const UserAuthForm = dynamic(() => import("../components/user-auth-form"), {
  ssr: false
});

export default async function Page() {
  const { t } = await getTranslation("login");

  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <UserAuthForm
        params={{
          action: "login",
          title: t("title"),
          description: t("description"),
          buttonText: t("buttonText")
        }}
      >
        <p className="text-center">
          {t("otherPageDescription")}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/signup"
          >
            {t("otherPageLinkText")}
          </Link>
        </p>
      </UserAuthForm>
    </div>
  );
}
