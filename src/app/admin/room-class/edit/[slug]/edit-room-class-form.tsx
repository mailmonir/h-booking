"use client";

import { z } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateRoomClass } from "@/app/admin/room-class/actions";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";
import { Feature, Bed_Type } from "@prisma/client";
import { createRoomClassSchema } from "@/app/admin/room-class/schema";
import Media from "@/app/admin/media/media";
import { ZodIssue } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Prisma } from "@prisma/client";

type RoomClassFormType = Prisma.Room_ClassGetPayload<{
  include: {
    features: true;
    room_class_bed_type: true;
  };
}>;
interface RoomClassFormProps {
  features: Feature[];
  bedTypes: Bed_Type[];
  roomClass: RoomClassFormType;
}

const EditRoomClassForm = ({
  features,
  bedTypes,
  roomClass,
}: RoomClassFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );

  console.log(roomClass);

  const form = useForm<z.infer<typeof createRoomClassSchema>>({
    resolver: zodResolver(createRoomClassSchema),
    defaultValues: {
      class_name: roomClass.class_name,
      description: roomClass.description || "",
      base_price: roomClass.base_price,
      image: roomClass.image,
      features: roomClass.features.map((feature) => feature.id),
      bedTypes: roomClass.room_class_bed_type.map((bedType) => ({
        bedtype: bedType.bed_type_id,
        numberOfBeds: bedType.num_beds.toString(),
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bedTypes",
  });

  const onSubmit = async (
    formValues: z.infer<typeof createRoomClassSchema>
  ) => {
    setMessage(undefined);

    const result = await updateRoomClass(formValues, roomClass.id);

    if (Array.isArray(result?.message)) {
      result.message.forEach((issue: ZodIssue) => {
        form.setError(
          issue.path[0] as keyof z.infer<typeof createRoomClassSchema>,
          {
            type: "custom",
            message: issue.message,
          }
        );
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
            Create room class
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground mb-8">
            Fill in the form below to create a new room class
          </p>

          {message && (
            <AlertMessage type={message.type} message={message.message} />
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4 self-center">
              <FormField
                control={form.control}
                name="class_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room class name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-4">
              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-full">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full">
              <FormLabel className="mb-3 block">
                Select room class features
              </FormLabel>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 border border-border p-4 rounded-md">
                {features.map((feature) => (
                  <FormField
                    key={feature.id}
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={feature.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={(field.value ?? []).includes(feature.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value ?? []),
                                      feature.id,
                                    ])
                                  : field.onChange(
                                      (field.value ?? []).filter(
                                        (value) => value !== feature.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {feature.feature_name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-full">
              <FormLabel className="mb-3 block">
                Select room class bed types
              </FormLabel>
              <div className="border border-border p-4 rounded-md flex flex-col gap-4">
                {fields.map((field, index) => {
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4"
                    >
                      <div className="md:col-span-2">
                        <Controller
                          name={`bedTypes.${index}.bedtype`}
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                form.clearErrors("bedTypes");
                                field.onChange(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select bed type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent defaultValue={field.value}>
                                {bedTypes.map((bedtype) => (
                                  <SelectItem
                                    key={bedtype.id}
                                    value={bedtype.id}
                                  >
                                    {bedtype.bed_type_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {form.formState.errors.bedTypes?.[index]?.bedtype && (
                          <p className="text-red-500 text-sm col-span-full mt-2">
                            {
                              form.formState.errors.bedTypes[index].bedtype
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Controller
                          name={`bedTypes.${index}.numberOfBeds`}
                          control={form.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Number of Beds"
                              type="number"
                            />
                          )}
                        />
                        <div>
                          {form.formState.errors.bedTypes?.[index]
                            ?.numberOfBeds && (
                            <p className="text-red-500 text-sm col-span-full">
                              {
                                form.formState.errors.bedTypes[index]
                                  .numberOfBeds?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <Button
                          onClick={() => remove(index)}
                          variant="outline"
                          type="button"
                          className="w-full"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {form.formState.errors.bedTypes?.root && (
                  <p className="text-red-500 text-sm w-full mt-2">
                    {form.formState.errors.bedTypes?.root?.message}
                  </p>
                )}
                <div className="col-span-full flex justify-start gap-4 mt-4">
                  <Button
                    onClick={() => append({ bedtype: "", numberOfBeds: "0" })}
                    variant="default"
                    type="button"
                    disabled={bedTypes.length === fields.length}
                  >
                    Add bed type
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Room class image</FormLabel>
                    <FormControl>
                      <Media onChange={onChange} existingImages={value} />
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

export default EditRoomClassForm;
