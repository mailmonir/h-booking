"use client";

import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "./ui/separator";
import { Category } from "@prisma/client";
import { productSchema } from "@/lib/schema";

export function CategoryBox({
  categories,
  form,
}: {
  categories: Category[];
  form: UseFormReturn<typeof productSchema>;
}) {
  return (
    <FormField
      control={form.control}
      name="categories"
      render={() => (
        <FormItem>
          {categories.map((category) => (
            <>
              <FormField
                key={category.id}
                control={form.control}
                name="items"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={category.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(category.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, category.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== category.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {category.name}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
              <Separator className="my-2" />
            </>
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
