"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema, VerifySchemaType } from "@/app/(auth)/schema";
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
import { verifyEmail, resendEmailVerificationCodeAction } from "./action";
import { ZodIssue } from "zod";
import { useVerifyEmailContext } from "@/context/verify-email-context";

const VerifyForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<VerifySchemaType>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const context = useVerifyEmailContext();

  const onSubmit = (values: VerifySchemaType) => {
    context.setMessage(undefined);

    startTransition(async () => {
      const response = await verifyEmail(values);
      if (typeof response.message === "string") {
        context.setMessage({
          type: response.type,
          message: response.message,
        });
      } else if (Array.isArray(response.message)) {
        const issues = response.message as ZodIssue[];
        issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof VerifySchemaType, {
            type: "custom",
            message: issue.message,
          });
        });
      } else {
        context.setMessage({
          type: response.type,
          message: "Unexpected error occurred. Please try again later.",
        });
      }
    });
  };

  return (
    <Form {...form}>
      {context.message?.message && (
        <AlertMessage
          type={context.message.type}
          message={context.message.message}
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <Input type="text" className="w-full bg-white" {...field} />
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
            className="w-full mt-6"
          >
            Veify email
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default VerifyForm;

export function ResendVerificationCode() {
  const [isLoading, startTransition] = useTransition();
  const context = useVerifyEmailContext();

  const handleResendCode = async () => {
    startTransition(async () => {
      const response = await resendEmailVerificationCodeAction();
      if (!response) {
        context.setMessage({
          type: "error",
          message: "Something went wrong. Please try again later",
        });
      } else {
        context.setMessage({
          type: "success",
          message: "Verification code sent successfully",
        });
      }
    });
  };

  return (
    <div>
      <LoadingButton
        variant={"outline"}
        type="button"
        className="w-full mt-8"
        onClick={handleResendCode}
        disabled={isLoading}
        loading={isLoading}
      >
        Resend code
      </LoadingButton>
    </div>
  );
}
