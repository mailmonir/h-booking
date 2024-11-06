"use client";

import { z, ZodIssue } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createFeature } from "@/app/admin/features/actions";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";
import { createFeatureSchema, CreateFeatureSchemaType } from "../schema";

const CreateFeatureForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof createFeatureSchema>>({
    resolver: zodResolver(createFeatureSchema),
    defaultValues: {
      feature_name: "",
    },
  });

  const onSubmit = async (formValues: CreateFeatureSchemaType) => {
    setMessage(undefined);

    const result = await createFeature(formValues);

    if (Array.isArray(result?.message)) {
      result.message.forEach((issue: ZodIssue) => {
        form.setError(issue.path[0] as keyof CreateFeatureSchemaType, {
          type: "custom",
          message: issue.message,
        });
      });
    } else {
      setMessage({
        type: result?.type,
        message: result?.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b border-border pb-12">
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Create feature
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground mb-8">
            Fill in the form below to create a new feature
          </p>

          {message && (
            <AlertMessage type={message.type} message={message.message} />
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <FormField
                control={form.control}
                name="feature_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature name</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-10">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="flex items-center gap-1"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            )}
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateFeatureForm;
