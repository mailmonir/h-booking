"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { updateMediaSchema } from "@/app/admin/media/schema";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";

import debounce from "debounce";
import { updateMedia } from "@/app/admin/media/media-action";
import { Media } from "@prisma/client";

const MediaUpdateForm = ({ mediaFile }: { mediaFile: Media }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof updateMediaSchema>>({
    resolver: zodResolver(updateMediaSchema),
  });

  const handleValueChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const response = await updateMedia(
      e.target.name,
      e.target.value,
      mediaFile.id
    );
    if ("error" in response) {
      setMessage({ type: "error", message: response.error });
    } else {
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form ref={formRef}>
        <div className="">
          {message !== undefined && (
            <AlertMessage type={message.type} message={message.message} />
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="title"
                render={() => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        name="title"
                        onChange={debounce(handleValueChange, 500)}
                        defaultValue={mediaFile.title || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-6">
              <FormField
                control={form.control}
                name="caption"
                render={() => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Input
                        name="caption"
                        onChange={debounce(handleValueChange, 500)}
                        defaultValue={mediaFile.caption || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-6">
              <FormField
                control={form.control}
                name="altText"
                render={() => (
                  <FormItem>
                    <FormLabel>Alternative Text</FormLabel>
                    <FormControl>
                      <Input
                        name="altText"
                        onChange={debounce(handleValueChange, 500)}
                        defaultValue={mediaFile.altText || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-6">
              <FormField
                control={form.control}
                name="description"
                render={() => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        name="description"
                        onChange={debounce(handleValueChange, 500)}
                        defaultValue={mediaFile.description || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default MediaUpdateForm;
