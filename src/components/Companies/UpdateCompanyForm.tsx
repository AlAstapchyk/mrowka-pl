"use client";

import React, {
  useState,
  useEffect,
} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CompanyForm from "./CompanyForm"; // basic fields: name, description
import CompanyProfileForm from "./CompanyProfileForm"; // profile fields: industry, website, etc.
import CompanyLogoUploader from "./CompanyLogoUploader";
import { companySchema, CompanyFormData } from "./companySchema";
import { CompanyProfile } from "@/db/schema";

export default function UpdateCompanyForm() {
  const { companyId } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<CompanyFormData | null>(null);
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

  useEffect(() => {
    if (!companyId) return;
    async function fetchData() {
      try {
        const { data: base } = await axios.get(
          `/api/companies/${companyId}`
        );

        let profile: Partial<CompanyProfile> = {};
        try {
          const { data } = await axios.get(
            `/api/company-profiles/${companyId}`
          );
          profile = data as CompanyProfile;
        } catch (err: any) {
          if (err.response?.status !== 404) {
            console.log("It's OK")
          }
        }

        const merged: CompanyFormData = {
          name: base.name,
          description: base.description ?? "",
          logoUrl: base.logoUrl ?? "",
          industry: profile.industry ?? "",
          website: profile.website ?? "",
          companySize: profile.companySize ?? undefined,
          companyDescription: profile.companyDescription ?? "",
        };

        setInitialData(merged);
        form.reset(merged);
      } catch (err) {
        console.error("Error fetching company data:", err);
        toast.error("Failed to load company data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const onSubmit = async (data: CompanyFormData) => {
    if (!companyId) return;
    setIsSubmitting(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

      const company = await axios.put(`${baseUrl}/api/companies/${companyId}/update`, data);

      // const hasProfileData =
      //   data.industry ||
      //   data.website ||
      //   data.companySize ||
      //   data.companyDescription;

      // if (hasProfileData) {
      //   // Try PUT first; if 404, do POST
      //   try {
      //     await axios.put(`${baseUrl}/api/company-profiles/${companyId}`, {
      //       companyId,
      //       logoUrl: data.logoUrl,
      //       industry: data.industry,
      //       website: data.website,
      //       companySize: data.companySize,
      //       companyDescription: data.companyDescription,
      //     });
      //   } catch (err: any) {
      //     if (err.response?.status === 404) {
      //       // Create if not exist
      //       await axios.post(`${baseUrl}/api/company-profiles`, {
      //         companyId,
      //         logoUrl: data.logoUrl,
      //         industry: data.industry,
      //         website: data.website,
      //         companySize: data.companySize,
      //         companyDescription: data.companyDescription,
      //       });
      //     } else {
      //       throw err;
      //     }
      //   }
      // } else {
      //   // If there is no profile data at all, call DELETE or PUT with nulls
      //   try {
      //     await axios.delete(`${baseUrl}/api/company-profiles/${companyId}`);
      //   } catch {
      //     // ignore if not exist
      //   }
      // }

      toast.success("Company updated successfully!");
      router.push(`/companies/${companyId}`);
    } catch (error: any) {
      toast.error("Failed to update company. Please try again.");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center p-6">
        <p>Unable to load company data.</p>
      </div>
    );
  }

  if (companyId)
    return (
      <div className="">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CompanyLogoUploader
              companyId={companyId as string}
              currentLogoUrl={initialData.logoUrl || undefined}
              onLogoUpdate={(url) => form.setValue("logoUrl", url || "")}
              size="md"
            />

            <CompanyForm />

            <hr className="my-6" />

            <h3 className="text-lg font-medium">Company Profile</h3>
            <CompanyProfileForm />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </FormProvider>
      </div>
    );
}
