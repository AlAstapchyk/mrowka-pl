"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CompanyForm from "./CompanyForm";
import { useAuth } from "@/providers/AuthProvider";
import { companySchema, CompanyFormData } from "./companySchema";

export default function RegisterCompanyForm() {
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: "",
            description: "",
            logoUrl: "",
            industry: "",
            website: "",
            companySize: undefined,
            companyDescription: "",
        },
    });

    const onSubmit = async (data: CompanyFormData) => {
        if (!user?.id) {
            toast.error("You must be logged in to register a company");
            return;
        }

        setIsSubmitting(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

            const { data: newCompany } = await axios.post(
                `${baseUrl}/api/companies/register`,
                {
                    name: data.name,
                    description: data.description,
                    logoUrl: data.logoUrl,
                    createdBy: user.id,
                }
            );

            toast.success("Company registered successfully!");
            router.push(`/companies/${newCompany.companyId}`);
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.error("A company with this name already exists");
            } else {
                toast.error("Failed to register company. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto p-6 text-center">
                <p>You must be logged in to register a company.</p>
            </div>
        );
    }

    return (
        <div className="">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <CompanyForm />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <LoadingSpinner className="mr-2 h-4 w-4" />
                                Registering Company...
                            </>
                        ) : (
                            "Register Company"
                        )}
                    </Button>
                </form>
            </FormProvider>
        </div>
    );
}
