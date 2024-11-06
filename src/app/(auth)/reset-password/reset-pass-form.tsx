"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassSchema, ResetPassSchemaType } from "@/app/(auth)/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/loading-button";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";
import PasswordInput from "@/components/password-input";
import { ZodIssue } from "zod";
import { resetPassword } from "./action";

const ResetPassForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );

  const form = useForm<ResetPassSchemaType>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = (values: ResetPassSchemaType) => {
    setMessage(undefined);

    startTransition(async () => {
      const response = await resetPassword(values);
      if (typeof response.message === "string") {
        setMessage({
          type: response.type,
          message: response.message,
        });
      } else if (Array.isArray(response.message)) {
        const issues = response.message as ZodIssue[];
        issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof ResetPassSchemaType, {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    type="password"
                    className="w-full bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password confirmation</FormLabel>
                <FormControl>
                  <PasswordInput
                    type="password"
                    className="w-full bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-8">
          <LoadingButton type="submit" loading={isPending} className="w-full">
            Reset password
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default ResetPassForm;
