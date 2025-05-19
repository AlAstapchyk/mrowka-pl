import JobApplicationClient from "@/components/Jobs/Apply/JobApplicationClient";
import { getJobOfferById, getUserById } from "@/db/queries";
import { createClient } from "@/utils/supabase/server";

export default async function JobApplicationPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const jobOffer = await getJobOfferById(id).catch((e) => undefined);

    if (!jobOffer) {
        return (
            <div className="flex flex-col gap-6 m-auto text-center">
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
            return <h1 className="text-center text-3xl font-serif font-semibold flex m-auto">You are recruiter! What are you looking for?</h1>
    }

    return <JobApplicationClient jobOffer={jobOffer} jobId={id} />;
}