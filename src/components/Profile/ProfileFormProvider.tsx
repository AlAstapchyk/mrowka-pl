"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { JobSeekerProfileForm } from "./JobSeekerProfileForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import AvatarUploader from "../AvatarUploader";
import { createClient } from "@/utils/supabase/client";
import CVUploader from "../CVUploader";
import { toast } from "sonner";

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
  const [loadingForm, setLoadingForm] = useState<boolean>(true);
  const hasFetched = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  useEffect(() => {
    if (!user || hasFetched.current) return;

    hasFetched.current = true;

    const fetchData = async () => {
      let baseUserData, jobsSeekerProfileData;
      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${user.id}`,
        );

        baseUserData = userResponse.data;

        if (baseUserData.role === "job_seeker") {
          try {
            const seekerRes = await axios.get(
              `${process.env.NEXT_PUBLIC_SITE_URL}/api/job-seeker-profiles/${user.id}`,
            );
            seekerRes.data.skills = seekerRes.data.skills.join(", ");
            jobsSeekerProfileData = seekerRes.data;
          } catch (error: any) {
            if (error.status === 404)
              console.warn(
                "No job seeker profile found. (Likely first time login)",
              );
            else console.error(error);
          }
        }
        // else if (baseUserData.role === "recruiter") {
        //   const recruiterRes = await axios.get(
        //     `${process.env.NEXT_PUBLIC_SITE_URL}/api/recruiters/${user.id}`,
        //   );
        //   setUserData((prev: any) => ({
        //     ...prev,
        //     ...recruiterRes.data,
        //   }));
        // }
      } catch (error: any) {
        if (error.status === 400) console.error(error.message);
      } finally {
        setUserData({
          ...baseUserData,
          ...(jobsSeekerProfileData ?? {}),
        });
        setLoadingForm(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    form.reset({
      fullName: userData?.fullName || "",
      phoneNumber: userData?.phoneNumber || "",
      skills: userData?.skills || "",
      education: userData?.education || "",
      locationPreference: userData?.locationPreference || "",
      linkedInUrl: userData?.linkedInUrl || "",
    });
  }, [userData]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const parsedSkills = data?.skills
        .split(",")
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 0);

      const updatedData = {
        ...data,
        skills: parsedSkills,
      };

      const supabase = createClient();

      const requests = [
        axios.put(`/api/users/${userData.id}`, updatedData),
      ];

      if (userData.role !== "recruter")
        requests.push(axios.put(`/api/job-seeker-profiles/${userData.id}`, updatedData));

      const responses = await Promise.all(requests);

      const allSuccessful = responses.every(
        (res) => res.status >= 200 && res.status < 300
      );

      if (!allSuccessful) throw new Error("One or more updates failed.");

      const { error: supabaseError } = await supabase.auth.updateUser({
        data: {
          full_name: updatedData.fullName,
        },
      });

      if (supabaseError) throw new Error(`Supabase update failed: ${supabaseError.message}`);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingForm) return <LoadingSpinner />;
  return (
    <div className="container mx-auto min-w-72 p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        {userData.role === "job_seeker"
          ? "Job Seeker Profile"
          : "Recruiter Profile"}
      </h1>

      {user ? <AvatarUploader userId={user.id} /> : ""}

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProfileInfoForm />

          <span className="text-sm">
            <b className="font-semibold">Email:</b> <i>{userData.email}</i>
          </span>

          <hr className="my-6" />


          {userData.role === "job_seeker" && (
            <>
              {user ? <CVUploader userId={user.id} /> : ""}
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
