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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES, EMPLOYMENT_TYPES, JOB_LEVELS, WORKING_MODES } from "@/mapping";

const JobOfferForm = () => {
    const { control } = useFormContext();

    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g. Senior Software Engineer, Marketing Manager"
                                {...field}
                            />
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
                        <FormLabel>Job Description *</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity unique..."
                                className="min-h-[200px]"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            Job Description supports markdown format
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={control}
                    name="minSalary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min Salary</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="5000"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="maxSalary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Salary</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="8000"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CURRENCIES.map((currency) => (
                                        <SelectItem key={currency.id} value={currency.id}>
                                            {currency.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g. Warsaw, Poland or Remote"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={control}
                    name="employmentType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Employment Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="w-full">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {EMPLOYMENT_TYPES.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.label}
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
                    name="jobLevel"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Level *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="w-full">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {JOB_LEVELS.map((level) => (
                                        <SelectItem key={level.id} value={level.id}>
                                            {level.label}
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
                    name="workingMode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Working Mode *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="w-full">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {WORKING_MODES.map((mode) => (
                                        <SelectItem key={mode.id} value={mode.id}>
                                            {mode.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

export default JobOfferForm;