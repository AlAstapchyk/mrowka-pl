import JobApplicationClient from "@/components/Jobs/Apply/JobApplicationClient";
import { getJobOfferById } from "@/db/queries/job-offers";
import { getUserById } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for a job offer | Mrowka.pl",
};

export default async function JobApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const jobOffer = await getJobOfferById(id).catch((e) => undefined);

  if (!jobOffer) {
    return (
      <div className="m-auto flex flex-col gap-6 text-center">
        <span className="mb-6 text-9xl font-semibold">404</span>
        <span className="text-xl">Job offer is not found</span>
      </div>
    );
  }

  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (user) {
    const userData = await getUserById(user.id);

    if (userData?.role === "recruiter")
      return (
        <h1 className="m-auto flex text-center font-serif text-3xl font-semibold">
          You are recruiter! What are you looking for?
        </h1>
      );
  }

  return <JobApplicationClient jobOffer={jobOffer} jobId={id} />;
}
