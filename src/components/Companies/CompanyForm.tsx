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
import { Textarea } from "@/components/ui/textarea";

const CompanyForm = () => {
    const { control } = useFormContext();

    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Brief description of your company..."
                                className="min-h-[100px]"
                                maxLength={200}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default CompanyForm;