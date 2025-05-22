import { getJobOfferById, getUserById, hasUserApplied } from "@/db/queries";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    MapPin,
    Clock,
    Layers,
    Building,
    DollarSign,
    BookmarkPlus,
} from "lucide-react";
import JobOfferCardHeader from "@/components/Jobs/View/JobOfferCardHeader";
import ReactMarkdown from "react-markdown";
import BackButton from "@/components/Jobs/BackButton";
import JobOfferCardFooter from "@/components/Jobs/View/JobOfferCardFooter";
import { createClient } from "@/utils/supabase/server";
import { EMPLOYMENT_TYPES, getLabelById, JOB_LEVELS, WORKING_MODES } from "@/mapping";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

const Page = async ({ params }: PageProps) => {
    const { id } = await params;
    const jobOffer = await getJobOfferById(id).catch((e) => { console.warn(e) });
    if (!jobOffer) return (
        <div className="flex flex-col gap-6 m-auto text-center">
            <span className="mb-6 text-9xl font-semibold">404</span>
            <span className="text-xl">Job offer is not found</span>
        </div>
    );

    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (user) {
        const userData = await getUserById(user.id);

        if (userData?.role === "recruiter")
            return <h1 className="text-center text-3xl font-serif font-semibold flex m-auto">You are recruiter! What are you looking for?</h1>
    }

    const alreadyApplied = user
        ? await hasUserApplied(user.id, id)
        : false;

    return (
        <div className="flex flex-col container mt-8 mx-auto px-4 max-w-3xl">
            <div className="mb-6 flex justify-between items-center">
                <BackButton />
                <Button variant="outline" className="border-black hover:bg-gray-100">
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    Save Job
                </Button>
            </div>

            <div className="sm:border sm:border-black max-sm:border-none shadow-none rounded-xl py-6" >
                <JobOfferCardHeader jobOffer={jobOffer} alreadyApplied={alreadyApplied} />

                <div className="space-y-6 max-sm:px-0 py-6 px-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span>{jobOffer.location}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5" />
                            <span>{jobOffer.minSalary?.toLocaleString("pl-PL")} - {jobOffer.maxSalary?.toLocaleString("pl-PL")} {jobOffer.currency}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5" />
                            <span>{getLabelById(WORKING_MODES, jobOffer.workingMode)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Briefcase className="w-5 h-5" />
                            <span>{getLabelById(EMPLOYMENT_TYPES, jobOffer.employmentType)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Layers className="w-5 h-5" />
                            <span>{getLabelById(JOB_LEVELS, jobOffer.jobLevel)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Building className="w-5 h-5" />
                            <span>{jobOffer.companyName}</span>
                        </div>
                    </div>

                    <div className="border-t border-black pt-4">
                        <h3 className="font-bold text-lg mb-2">Job Description</h3>
                        <div className="prose space-y-4">
                            <ReactMarkdown>{jobOffer.description}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                <JobOfferCardFooter jobId={id} alreadyApplied={alreadyApplied} />
            </div>

            <p className="my-4 text-sm text-gray-500 text-right">
                Job ID: {id}
            </p>
        </div>
    );
};

export default Page;