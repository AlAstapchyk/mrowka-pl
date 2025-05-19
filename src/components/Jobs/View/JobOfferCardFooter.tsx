import { Button } from "../../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const JobOfferCardFooter = ({ jobId, alreadyApplied }: { jobId: string, alreadyApplied: boolean }) => {
    return (
        <div className="border-t border-black pt-6 flex justify-center">
            {alreadyApplied ? (
                <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md opacity-50">
                    Already Applied
                </div>
            ) : (
                <Button
                    asChild
                    variant="default"
                    className="bg-black text-white hover:bg-gray-800"
                >
                    <Link href={`/jobs/apply/${jobId}`} className="flex items-center gap-2">
                        <span>Apply for this position</span>
                        <ArrowRight />
                    </Link>
                </Button>
            )}

        </div>
    );
};

export default JobOfferCardFooter;
