"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const ProfileInfoForm = () => {
  const { control } = useFormContext(); // Access the form context

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="avatarUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Avatar URL</FormLabel>
            <FormControl>
              <Input placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input placeholder="Jakub Kowalski" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
