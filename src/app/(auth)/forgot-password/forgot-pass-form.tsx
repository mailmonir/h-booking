"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassSchema, ForgotPassSchemaType } from "@/app/(auth)/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";
import { forgotPassowrd } from "./action";
import { ZodIssue } from "zod";

const ResetPassForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );

  const form = useForm<ForgotPassSchemaType>({
    resolver: zodResolver(forgotPassSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPassSchemaType) => {
    setMessage(undefined);
    startTransition(async () => {
      const response = await forgotPassowrd(values);
      if (typeof response.message === "string") {
        setMessage({
          type: response.type,
          message: response.message,
        });
      } else if (Array.isArray(response.message)) {
        const issues = response.message as ZodIssue[];
        issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof ForgotPassSchemaType, {
            type: "custom",
            message: issue.message,
          });
        });
      } else {
        setMessage({
          type: response.type,
          message: "Unexpected error occurred. Please try again later.",
        });
      }
    });
  };

  return (
    <Form {...form}>
      {message && (
        <AlertMessage type={message.type} message={message.message} />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="w-full bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <LoadingButton
            type="submit"
            loading={isPending}
            className="w-full mt-8"
          >
            Send
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default ResetPassForm;
