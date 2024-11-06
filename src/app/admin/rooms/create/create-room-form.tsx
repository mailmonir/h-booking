"use client";

import { z, ZodIssue } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createRoom } from "@/app/admin/rooms/actions";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";
import { createRoomSchema, CreateRoomSchemaType } from "../schema";
import { Room_Class, Floor, Room_Status } from "@prisma/client";
import { getRoomClasses } from "../../room-class/actions";
import { getRoomStatuses } from "../../room-status/actions";
import { getFloors } from "../../floors/actions";
import Media from "@/app/admin/media/media";

const CreateRoomForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );
  const [roomClasses, setRoomClasses] = useState<Room_Class[] | []>([]);
  const [roomFloors, setRoomFloors] = useState<Floor[] | []>([]);
  const [roomStatuses, setRoomStatuses] = useState<Room_Status[] | []>([]);

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      room_number: "",
      room_class_id: "",
      floor_id: "",
      room_status_id: "",
      room_images: [],
    },
  });

  useEffect(() => {
    const fetchSelectBoxData = async () => {
      const roomClasses = await getRoomClasses();
      setRoomClasses(roomClasses);
      const roomFloors = await getFloors();
      setRoomFloors(roomFloors);
      const roomStatuses = await getRoomStatuses();
      setRoomStatuses(roomStatuses);
    };
    fetchSelectBoxData();
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  const onSubmit = async (formValues: CreateRoomSchemaType) => {
    setMessage(undefined);

    const result = await createRoom(formValues);

    if (Array.isArray(result?.message)) {
      result.message.forEach((issue: ZodIssue) => {
        form.setError(issue.path[0] as keyof CreateRoomSchemaType, {
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
            Create room
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground mb-8">
            Fill in the form below to create a new room
          </p>

          {message && (
            <AlertMessage type={message.type} message={message.message} />
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <FormField
                control={form.control}
                name="room_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="room_class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room class</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select room class"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomClasses?.map((roomClass) => (
                          <SelectItem key={roomClass.id} value={roomClass.id}>
                            {roomClass.class_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="floor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room floor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomFloors?.map((roomFloor) => (
                          <SelectItem key={roomFloor.id} value={roomFloor.id}>
                            {roomFloor.floor_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="room_status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomStatuses?.map((roomStatus) => (
                          <SelectItem key={roomStatus.id} value={roomStatus.id}>
                            {roomStatus.status_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full">
              <FormField
                control={form.control}
                name="room_images"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Room image</FormLabel>
                    <FormControl>
                      <Media onChange={onChange} multiple />
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

export default CreateRoomForm;
