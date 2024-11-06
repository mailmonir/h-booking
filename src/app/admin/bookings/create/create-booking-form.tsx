"use client";

import { z, ZodIssue } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { createBooking } from "@/app/admin/bookings/actions";
import { AlertMessage } from "@/components/alert-message";
import { AlertMessageProps } from "@/components/alert-message";
import { createBookingSchema, CreateBookingSchemaType } from "../schema";
import { User, Payment_Status } from "@prisma/client";
import { getGuests } from "@/app/admin/users/actions";
import { getRooms } from "@/app/admin/rooms/actions";
import { getPaymentStatuses } from "@/app/admin/payment-status/actions";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar as CalendarIcon } from "lucide-react";
import { Prisma, Addon } from "@prisma/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getAddons } from "@/app/admin/addons/actions";

// const guests = [
//   { label: "English", value: "en" },
//   { label: "French", value: "fr" },
//   { label: "German", value: "de" },
//   { label: "Spanish", value: "es" },
//   { label: "Portuguese", value: "pt" },
//   { label: "Russian", value: "ru" },
//   { label: "Japanese", value: "ja" },
//   { label: "Korean", value: "ko" },
//   { label: "Chinese", value: "zh" },
// ];

type RoomWithRelatedData = Prisma.RoomGetPayload<{
  include: {
    room_status: true;
    floor: true;
    room_class: true;
  };
}>;

const CreateBookingForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [message, setMessage] = useState<AlertMessageProps | undefined>(
    undefined
  );
  const [guests, setGuests] = useState<User[] | []>([]);
  const [rooms, setRooms] = useState<RoomWithRelatedData[] | []>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<Payment_Status[] | []>(
    []
  );
  const [addOns, setAddons] = useState<Addon[] | []>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredRooms = rooms.filter(
    (room) =>
      room.room_number.includes(searchTerm) ||
      room.room_class.class_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const form = useForm<z.infer<typeof createBookingSchema>>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      guest_id: "",
      room_id: "",
      payment_status_id: "",
      check_in_date: new Date(),
      check_out_date: new Date(),
      num_adults: 0,
      num_children: 0,
      booking_amount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addOns",
  });

  useEffect(() => {
    const fetchSelectBoxData = async () => {
      const guests = await getGuests();
      setGuests(guests);
      const rooms = await getRooms();
      setRooms(rooms);
      const paymentStatuses = await getPaymentStatuses();
      setPaymentStatuses(paymentStatuses);
      const addOns = await getAddons();
      setAddons(addOns);
    };
    fetchSelectBoxData();
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  const onSubmit = async (formValues: CreateBookingSchemaType) => {
    setMessage(undefined);

    console.log(formValues);

    // const result = await createBooking(formValues);

    // if (Array.isArray(result?.message)) {
    //   result.message.forEach((issue: ZodIssue) => {
    //     form.setError(issue.path[0] as keyof CreateBookingSchemaType, {
    //       type: "custom",
    //       message: issue.message,
    //     });
    //   });
    // } else {
    //   setMessage({
    //     type: result?.type,
    //     message: result?.message,
    //   });
    // }
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b border-border pb-12">
          <h2 className="text-base font-semibold leading-7 text-foreground">
            Create Booking
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground mb-8">
            Fill in the form below to create a new booking
          </p>

          {message && (
            <AlertMessage type={message.type} message={message.message} />
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="guest_id"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Guest</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? guests.find(
                                    (guest) => guest.id === field.value
                                  )?.email
                                : "Select guest"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[328px] p-0">
                          <Command>
                            <CommandInput placeholder="Search guest..." />
                            <CommandList>
                              <CommandEmpty>No guest found.</CommandEmpty>
                              <CommandGroup>
                                {guests.map((guest) => (
                                  <CommandItem
                                    value={guest.email}
                                    key={guest.id}
                                    onSelect={() => {
                                      form.setValue("guest_id", guest.id);
                                    }}
                                  >
                                    {guest.email} - {guest.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        guest.email === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                {/* <FormField
                  control={form.control}
                  name="room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms?.map((room) => (
                            <SelectItem
                              key={room.id}
                              value={room.id}
                              disabled={
                                (room.room_status.status_name as string) !==
                                "Available"
                              }
                            >
                              Room:{room.room_number}, Floor:
                              {room.floor.floor_number}, Type:{" "}
                              {room.room_class.class_name}, $
                              {room.room_class.base_price},{" "}
                              {room.room_status.status_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="room_id"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Room</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? rooms.find((room) => room.id === field.value)
                                    ?.room_number
                                : "Select room"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[328px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search room..."
                              onValueChange={setSearchTerm}
                            />
                            <CommandList>
                              <CommandEmpty>No room found.</CommandEmpty>
                              <CommandGroup>
                                {filteredRooms.map((room) => (
                                  <CommandItem
                                    value={room.room_number}
                                    key={room.id}
                                    onSelect={() => {
                                      form.setValue("room_id", room.id);
                                      form.setValue(
                                        "booking_amount",
                                        room.room_class.base_price
                                      );
                                    }}
                                    disabled={
                                      (room.room_status
                                        .status_name as string) !== "Available"
                                    }
                                  >
                                    {room.room_number} -{" "}
                                    {room.room_class.class_name} -{" "}
                                    {room.room_class.base_price} -
                                    {room.room_status.status_name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        room.room_number === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="col-span-full grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="payment_status_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentStatuses?.map((paymentStatus) => (
                            <SelectItem
                              key={paymentStatus.id}
                              value={paymentStatus.id}
                            >
                              {paymentStatus.payment_status_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="booking_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking amount</FormLabel>
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
            </div>
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="check_in_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check in date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            disabled={(date) => date <= new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="check_out_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check out date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            disabled={(date) => date <= new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="col-span-full gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="num_adults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nos Adult</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="focus-visible:ring-0"
                          min="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="num_children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nos Child</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          className="focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="col-span-full">
              <FormLabel className="mb-3 block">Add on</FormLabel>
              <div className="border border-border p-4 rounded-md flex flex-col gap-4">
                {fields.map((field, index) => {
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-8 gap-4"
                    >
                      <div className="md:col-span-4">
                        <Controller
                          name={`addOns.${index}.addon_name`}
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                // form.clearErrors("addOns");
                                console.log(value);
                                form.setValue(
                                  `addOns.${index}.price`,
                                  Number(
                                    addOns.find((addOn) => addOn.id === value)
                                      ?.price
                                  )
                                );
                                field.onChange(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select addon" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {addOns.map((addOn) => (
                                  <SelectItem key={addOn.id} value={addOn.id}>
                                    {addOn.addon_name}-${addOn.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {form.formState.errors.addOns?.[index]?.addon_name && (
                          <p className="text-destructive text-xs font-semibold col-span-full mt-2">
                            {
                              form.formState.errors.addOns[index].addon_name
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Controller
                          name={`addOns.${index}.price`}
                          control={form.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Addon price"
                              type="number"
                            />
                          )}
                        />
                        <div>
                          {form.formState.errors.addOns?.[index]?.price && (
                            <p className="text-destructive text-xs font-semibold mt-2 col-span-full">
                              {
                                form.formState.errors.addOns[index].price
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
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
                {form.formState.errors.addOns?.root && (
                  <p className="text-destructive text-sm w-full mt-2">
                    {form.formState.errors.addOns?.root?.message}
                  </p>
                )}
                <div className="col-span-full flex justify-start gap-4 mt-4">
                  <Button
                    onClick={() => append({ addon_name: "", price: 0 })}
                    variant="default"
                    type="button"
                    disabled={addOns.length === fields.length}
                  >
                    Add addon
                  </Button>
                </div>
              </div>
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

export default CreateBookingForm;
