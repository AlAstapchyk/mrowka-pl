import { Button } from "../../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const JobOfferCardFooter = ({
  jobId,
  alreadyApplied,
  role
}: {
  jobId: string;
  alreadyApplied: boolean;
  role?: string;
}) => {
  return (
    <div className="flex justify-center border-t border-black pt-6">
      {alreadyApplied ? (
        <div className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white opacity-50">
          Already Applied
        </div>
      ) : (
        <Button
          asChild
          variant="default"
          className="bg-black text-white hover:bg-gray-800"
          disabled={role === "recruiter"}
        >
          <Link
            href={`/jobs/apply/${jobId}`}
            className="flex items-center gap-2"
          >
            <span>Apply for this position</span>
            <ArrowRight />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default JobOfferCardFooter;
