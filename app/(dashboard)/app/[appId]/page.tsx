"use client";

import React, { FC, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { useTranslation } from "@/app/i18n/client";

const Page: FC = () => {
  const { t } = useTranslation("app-detail");
  const [prefixPropmt, setPrefixPrompt] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");

  function handleEnterPrefixPrompt(value: string) {
    setPrefixPrompt(value);
  }

  function handleInputPrompt(value: string) {
    setInputPrompt(value);
  }

  function handleSendMessage() {
    console.log(prefixPropmt);
  }

  return (
    <div className="flex h-screen">
      <div className="mr-4 w-1/2">
        <Textarea
          className="h-2/3"
          placeholder={t("prefixPropmtPlaceholder")}
          onChange={(e) => handleEnterPrefixPrompt(e.target.value)}
        />
      </div>
      <div className="relative h-4/5 w-1/2 rounded-lg border">
        <div className="absolute bottom-5  w-full px-5">
          <div className="flex items-center">
            <Input
              type="message"
              placeholder={t("messageInputPlaceholder")}
              onChange={(e) => handleInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (Object.is(e.key, "Enter")) handleSendMessage();
              }}
            />
            <SendHorizontal
              className={cn([
                "cursor-pointe absolute right-8 text-gray-400",
                {
                  "cursor-pointer text-black": inputPrompt.length > 0
                }
              ])}
              onClick={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Page);
