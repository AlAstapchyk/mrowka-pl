"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { JobSeekerProfileForm } from "./JobSeekerProfileForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import AvatarUploader from "./AvatarUploader";
import { createClient } from "@/utils/supabase/client";
import CVUploader from "./CVUploader";
import { toast } from "sonner";
import { User } from "@/db/schema";

const profileSchema = z.object({
  fullName: z.string().min(1, "Required"),
  phoneNumber: z.string(),
  linkedInUrl: z.string(),
  skills: z.string(),
  education: z.string(),
  locationPreference: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const hasFetched = useRef(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      skills: "",
      education: "",
      locationPreference: "",
      linkedInUrl: "",
    },
  });

  const formData = useMemo(() => ({
    fullName: userData?.fullName || "",
    phoneNumber: userData?.phoneNumber || "",
    skills: userData?.skills || "",
    education: userData?.education || "",
    locationPreference: userData?.locationPreference || "",
    linkedInUrl: userData?.linkedInUrl || "",
  }), [userData]);

  useEffect(() => {
    if (!user || hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        const userRequest = axios.get(`${baseUrl}/api/users/${user.id}`);

        const userResponse = await userRequest;
        const baseUserData = userResponse.data;

        setUserData(baseUserData);
        setIsLoading(false);

        if (baseUserData.role === "job_seeker") {
          const seekerResponse = await axios.get(
            `${baseUrl}/api/job-seeker-profiles/${user.id}`
          );

          const jobSeekerData = {
            ...seekerResponse.data,
            skills: seekerResponse.data.skills?.join(", ") || ""
          };

          setUserData((prev: User) => ({ ...prev, ...jobSeekerData }));
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const hasData = Object.values(formData).some(value => value !== "");
    if (hasData) {
      form.reset(formData);
    }
  }, [formData, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!userData?.id) return;

    setIsSubmitting(true);
    try {
      const parsedSkills = data.skills
        ?.split(",")
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 0) || [];

      const updatedData = { ...data, skills: parsedSkills };

      const requests = [
        axios.put(`/api/users/${userData.id}`, updatedData)
      ];

      if (userData.role === "job_seeker") {
        requests.push(
          axios.put(`/api/job-seeker-profiles/${userData.id}`, updatedData)
        );
      }

      // Execute API calls and Supabase update in parallel
      const [apiResponses, supabaseResult] = await Promise.allSettled([
        Promise.all(requests),
        createClient().auth.updateUser({
          data: { full_name: updatedData.fullName }
        })
      ]);

      if (apiResponses.status === "fulfilled") {
        const allSuccessful = apiResponses.value.every(
          (res) => res.status >= 200 && res.status < 300
        );
        if (!allSuccessful) throw new Error("One or more API updates failed");
      } else {
        throw new Error("API requests failed");
      }

      if (supabaseResult.status === "fulfilled" && supabaseResult.value.error) {
        throw new Error(`Supabase update failed: ${supabaseResult.value.error.message}`);
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !userData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto min-w-72 p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        {userData?.role === "job_seeker"
          ? "Job Seeker Profile"
          : "Recruiter Profile"}
      </h1>

      {user && <AvatarUploader userId={user.id} />}

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProfileInfoForm />

          <span className="text-sm">
            <b className="font-semibold">Email:</b> <i>{userData?.email}</i>
          </span>

          <hr className="my-6" />

          {userData?.role === "job_seeker" && (
            <>
              {user && <CVUploader userId={user.id} />}
              <JobSeekerProfileForm />
            </>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving Profile..." : "Save Profile"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}