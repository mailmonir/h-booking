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
import { updateRoomStatus } from "@/app/admin/room-status/actions";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";

import {
  createRoomStatusSchema,
  CreateRoomStatusSchemaType,
} from "@/app/admin/room-status/schema";
import { Room_Status } from "@prisma/client";

const EditRoomStatusForm = ({ roomStatus }: { roomStatus: Room_Status }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof createRoomStatusSchema>>({
    resolver: zodResolver(createRoomStatusSchema),
    defaultValues: {
      status_name: roomStatus.status_name,
    },
  });

  const onSubmit = async (
    formValues: z.infer<typeof createRoomStatusSchema>
  ) => {
    setMessage(undefined);

    const result = await updateRoomStatus(formValues, roomStatus.id);

    if (Array.isArray(result?.message)) {
      result.message.forEach((issue: ZodIssue) => {
        form.setError(issue.path[0] as keyof CreateRoomStatusSchemaType, {
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
            Update RoomStatus
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground mb-8">
            Edit the form below to update the RoomStatus
          </p>

          {message && (
            <AlertMessage type={message.type} message={message.message} />
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <FormField
                control={form.control}
                name="status_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RoomStatus name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditRoomStatusForm;
