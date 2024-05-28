"use client";

import React, { FC, useState, useTransition, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { cn, postAndStream } from "@/lib/utils";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import type { ToastProps } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { useTranslation } from "@/app/i18n/client";

const Page: FC = () => {
  const { t } = useTranslation("app-detail");
  const { t: errorMessageT } = useTranslation("error-message");

  const { toast } = useToast();
  const [prefixPropmt, setPrefixPrompt] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [responseMessages, setResponseMessages] = useState<string[]>([""]);
  const [isPending, startTransition] = useTransition();

  const responseSectionRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLInputElement>(null);

  let scrollHeight = 0;
  const responseSectionHeight = 630;
  if (responseSectionRef.current)
    scrollHeight = responseSectionRef.current.scrollHeight;
  useEffect(() => {
    if (bottomRef.current && scrollHeight > responseSectionHeight) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollHeight]);

  function handleEnterPrefixPrompt(value: string) {
    setPrefixPrompt(value);
  }

  function handleInputPrompt(value: string) {
    setInputPrompt(value);
  }

  async function handleSendMessage() {
    setInputPrompt("");
    try {
      await postAndStream(
        "http://localhost:11434/api/chat",
        {
          model: "phi3",
          stream: true,
          messages: [
            {
              role: "system",
              content: prefixPropmt
            },
            {
              role: "user",
              content: inputPrompt
            }
          ]
        },
        (chunk) => {
          if (chunk.done) {
            responseMessages.push("");
          } else {
            const index = responseMessages.length - 1;
            responseMessages[index] =
              responseMessages[index] + chunk.message.content;
          }
          startTransition(() => {
            setResponseMessages(responseMessages);
          });
        }
      );
    } catch (e) {
      const toastProps: ToastProps & { description?: React.ReactNode } = {
        variant: "destructive",
        title: errorMessageT("error"),
        description: errorMessageT("unknownErrorOccurred")
      };
      if (e instanceof Error) toastProps.description = e.message;
      toast(toastProps);
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mr-4 md:w-1/2">
        <Textarea
          className="h-[400px]"
          placeholder={t("prefixPropmtPlaceholder")}
          onChange={(e) => handleEnterPrefixPrompt(e.target.value)}
        />
      </div>
      <div className="h-[700px] rounded-lg border md:w-1/2">
        <div className="h-[630px]">
          <div
            ref={responseSectionRef}
            className={`h-[${responseSectionHeight}px] overflow-y-auto px-5 py-4`}
          >
            {responseMessages.map((message, index) => {
              if (message)
                return <ResponseBlock key={index} message={message} />;
            })}
            <div ref={bottomRef}></div>
          </div>
        </div>
        <div className="h-[70px] w-full py-3">
          <div className="relative flex items-center px-5">
            <Input
              type="message"
              value={inputPrompt}
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

function ResponseBlock({ message }: { message: string }) {
  return (
    <div className="mt-4">
      <div className="flex items-start space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/ai.jpeg" alt="AI" />
          <AvatarFallback className="bg-black">AI</AvatarFallback>
        </Avatar>
        <div className="w-full rounded-lg bg-gray-200 p-3 text-sm">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Page);
