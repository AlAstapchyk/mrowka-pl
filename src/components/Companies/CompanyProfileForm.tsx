"use client";

import { useFormContext } from "react-hook-form";
import {
    FormField,
    FormLabel,
    FormControl,
    FormItem,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CompanyProfileForm = () => {
    const { control } = useFormContext();

    const companySizes = [
        { value: "micro", label: "Micro (1-9 employees)" },
        { value: "small", label: "Small (10-49 employees)" },
        { value: "medium", label: "Medium (50-249 employees)" },
        { value: "large", label: "Large (250-999 employees)" },
        { value: "enterprise", label: "Enterprise (1000+ employees)" },
    ];

    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="industry"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g. Technology, Healthcare, Finance"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="website"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="https://www.yourcompany.com"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="companySize"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {companySizes.map((size) => (
                                    <SelectItem key={size.value} value={size.value}>
                                        {size.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="companyDescription"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Detailed Company Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Tell us more about your company, its mission, values, and what makes it unique..."
                                className="min-h-[150px]"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            Detailed Company Description has markdown format
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default CompanyProfileForm;