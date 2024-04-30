import dynamic from "next/dynamic";
import { useTranslation } from "@/app/i18n";

const Form = dynamic(
  () => import("../components/form").then((mod) => mod.Form),
  {
    ssr: false
  }
);

export default async function Page() {
  const { t } = await useTranslation("signup");

  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <Form
        params={{
          title: t("title"),
          description: t("description"),
          buttonText: t("buttonText")
        }}
      />
    </div>
  );
}
