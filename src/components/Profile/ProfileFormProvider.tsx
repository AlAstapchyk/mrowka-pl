"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { JobSeekerProfileForm } from "./JobSeekerProfileForm";
import LoadingSpinner from "../LoadingSpinner";
import AvatarUploader from "../AvatarUploader";
import { supabase } from "@/utils/supabase/client";

const profileSchema = z.object({
  fullName: z.string().min(1, "Required"),
  phoneNumber: z.string(),
  resumeLink: z.string(),
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

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      resumeLink: "",
      skills: "",
      education: "",
      locationPreference: "",
      linkedInUrl: "",
    },
  });

  useEffect(() => {
    if (!user || !loadingForm) return;

    const fetchData = async () => {
      let baseUserData, jobsSeekerProfileData;
      try {
        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${user.id}`,
        );

        baseUserData = userResponse.data;

        if (baseUserData.role === "job_seeker") {
          const seekerRes = await axios
            .get(
              `${process.env.NEXT_PUBLIC_SITE_URL}/api/job-seeker-profiles/${user.id}`,
            )
            .catch();
          seekerRes.data.skills = seekerRes.data.skills.join(", ");
          jobsSeekerProfileData = seekerRes.data;
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
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setUserData({
          ...baseUserData,
          ...jobsSeekerProfileData,
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
      resumeLink: userData?.resumeLink || "",
      skills: userData?.skills || "",
      education: userData?.education || "",
      locationPreference: userData?.locationPreference || "",
      linkedInUrl: userData?.linkedInUrl || "",
    });
  }, [userData]);

  const onSubmit = (data: ProfileFormData) => {
    const parsedSkills = data.skills
      .split(",")
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0);

    const updatedData = {
      ...data,
      skills: parsedSkills,
    };

    console.log("Updated Data:", updatedData);

    axios
      .put(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${userData.id}`,
        updatedData,
      )
      .then((response) => {
        console.log("User profile updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating user profile:", error);
      });

    axios
      .put(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/job-seeker-profiles/${userData.id}`,
        updatedData,
      )
      .then((response) => {
        console.log("Job seeker profile updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating job seeker profile:", error);
      });

    supabase.auth.updateUser({
      data: {
        full_name: updatedData.fullName,
      },
    });
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
              <JobSeekerProfileForm />
            </>
          )}

          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
