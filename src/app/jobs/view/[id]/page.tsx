import {
  Briefcase,
  MapPin,
  Clock,
  Layers,
  Building,
  DollarSign,
} from "lucide-react";
import JobOfferCardHeader from "@/components/Jobs/View/JobOfferCardHeader";
import ReactMarkdown from "react-markdown";
import BackButton from "@/components/Jobs/BackButton";
import JobOfferCardFooter from "@/components/Jobs/View/JobOfferCardFooter";
import { createClient } from "@/utils/supabase/server";
import {
  EMPLOYMENT_TYPES,
  getLabelById,
  JOB_LEVELS,
  WORKING_MODES,
} from "@/mapping";
import SaveJobOfferButton from "@/components/Jobs/View/SaveJobOfferButton";
import { getJobOfferById } from "@/db/queries/job-offers";
import { getUserById } from "@/db/queries/users";
import { hasUserApplied } from "@/db/queries/job-applications";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View a job offer | Mrowka.pl",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const jobOffer = await getJobOfferById(id).catch((e) => {
    console.warn(e);
  });
  if (!jobOffer)
    return (
      <div className="m-auto flex flex-col gap-6 text-center">
        <span className="mb-6 text-9xl font-semibold">404</span>
        <span className="text-xl">Job offer is not found</span>
      </div>
    );

  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  const alreadyApplied = user ? await hasUserApplied(user.id, id) : false;

  let role;

  if (user)
    role = (await getUserById(user.id))?.role;

  return (
    <div className="container mx-auto mt-8 flex max-w-3xl flex-col px-4">
      <div className="mb-6 flex items-center justify-between">
        <BackButton />
        <SaveJobOfferButton jobId={id} />
      </div>

      <div className="rounded-xl py-6 shadow-none max-sm:border-none sm:border sm:border-black">
        <JobOfferCardHeader
          jobOffer={jobOffer}
          alreadyApplied={alreadyApplied}
          role={role}
        />

        <div className="space-y-6 px-6 py-6 max-sm:px-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{jobOffer.location}</span>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>
                {jobOffer.minSalary?.toLocaleString("pl-PL")} -{" "}
                {jobOffer.maxSalary?.toLocaleString("pl-PL")}{" "}
                {jobOffer.currency}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{getLabelById(WORKING_MODES, jobOffer.workingMode)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>
                {getLabelById(EMPLOYMENT_TYPES, jobOffer.employmentType)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5" />
              <span>{getLabelById(JOB_LEVELS, jobOffer.jobLevel)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>{jobOffer.companyName}</span>
            </div>
          </div>

          <div className="border-t border-black pt-4">
            <h3 className="mb-2 text-lg font-bold">Job Description</h3>
            <div className="prose space-y-4">
              <ReactMarkdown>{jobOffer.description}</ReactMarkdown>
            </div>
          </div>
        </div>

        <JobOfferCardFooter jobId={id} alreadyApplied={alreadyApplied} role={role} />
      </div>

      <p className="my-4 text-right text-sm text-gray-500">Job ID: {id}</p>
    </div>
  );
};

export default Page;
