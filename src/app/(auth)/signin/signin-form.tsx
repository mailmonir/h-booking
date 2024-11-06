"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninSchemaType } from "@/app/(auth)/schema";
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
import PasswordInput from "@/components/password-input";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";
import { signIn } from "./action";
import Link from "next/link";
import { ZodIssue } from "zod";

const SignInForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SigninSchemaType) => {
    setMessage(undefined);

    startTransition(async () => {
      const response = await signIn(values);
      if (typeof response.message === "string") {
        setMessage({
          type: response.type,
          message: response.message,
        });
      } else if (Array.isArray(response.message)) {
        const issues = response.message as ZodIssue[];
        issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof SigninSchemaType, {
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
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Email</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="font-medium">Password</FormLabel>
                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-semibold text-primary hover:text-primary/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <FormControl>
                  <PasswordInput
                    type="password"
                    {...field}
                    className="bg-white"
                  />
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
            Sign in
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
