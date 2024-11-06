"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchemaType, signupSchema } from "@/app/(auth)/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/loading-button";
import { useTransition } from "react";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";
import PasswordInput from "@/components/password-input";
import { signUp } from "./action";
import { ZodIssue } from "zod";

const SignUpForm = () => {
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "Monirul Islam",
      email: "mailmonir@gmail.com",
      password: "Pushpita@2008",
      passwordConfirmation: "Pushpita@2008",
    },
  });

  const onSubmit = (values: SignupSchemaType) => {
    setMessage(undefined);
    startTransition(async () => {
      const response = await signUp(values);
      if (typeof response.message === "string") {
        setMessage({
          type: response.type,
          message: response.message,
        });
      } else if (Array.isArray(response.message)) {
        const issues = response.message as ZodIssue[];
        issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof SignupSchemaType, {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Name</Label>
                <FormControl>
                  <Input type="text" className="w-full bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input type="email" className="w-full bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>Password</Label>
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
                <Label>Password confirmation</Label>
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
          <LoadingButton
            type="submit"
            loading={isPending}
            className="w-full mt-8"
          >
            Sign up
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
