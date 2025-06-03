"use client";

import React, {
  useState,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import JobOfferForm from "./JobOfferForm"; // basic fields: title, description
import { jobOfferSchema, JobOfferFormData } from "./jobOfferSchema";

export default function CreateJobOfferForm() {
  const { companyId } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      title: "",
      description: "",
      minSalary: undefined,
      maxSalary: undefined,
      currency: "PLN",
      location: "",
      employmentType: "",
      jobLevel: "",
      workingMode: "",
    },
  });

  const onSubmit = async (data: JobOfferFormData) => {
    if (!companyId) return;
    setIsSubmitting(true);

    try {
      const jobOffer = await axios.post(`/api/job-offers`, {
        ...data,
        companyId,
      });

      toast.success("Job offer created successfully!");
      router.push(`/companies/${companyId}/offers`)
    } catch (error: any) {
      toast.error("Failed to create job offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!companyId) {
    return (
      <div className="text-center p-6">
        <p>Company ID is required to create a job offer.</p>
      </div>
    );
  }

  return (
    <div className="">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <JobOfferForm />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Creating Job Offer...
              </>
            ) : (
              "Create Job Offer"
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}