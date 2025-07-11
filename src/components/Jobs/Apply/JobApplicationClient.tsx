"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";

export default function JobApplicationClient({
  jobOffer,
  jobId,
}: {
  jobOffer: any;
  jobId: string;
}) {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "/api/job-applications",
        {
          jobId,
          userId: user.id,
          coverLetter,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.status !== 200) throw new Error("Failed to submit application");

      toast("Application submitted", {
        description: "Your application has been successfully submitted!",
      });

      router.push(`/jobs/view/${jobId}`);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "There was an error submitting your application.";

      toast("Application failed", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="mb-6 border-black hover:bg-gray-100"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>

      <div className="rounded-xl py-6 shadow-none max-sm:border-none sm:border sm:border-black">
        <div className="pb-6 sm:px-6">
          <h1 className="text-2xl">Apply for: {jobOffer.title}</h1>
          <p className="text-gray-500">{jobOffer.companyName}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-6 max-sm:px-0">
            <Alert>
              <AlertTitle>Application Notice</AlertTitle>
              <AlertDescription className="flex gap-1.5">
                Your profile data will be shared with the employer. You can
                update it on the{" "}
                <a href="/profile" className="text-blue-600 underline">
                  profile page
                </a>
                .
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <label htmlFor="coverLetter" className="font-medium">
                Cover Letter
              </label>
              <Textarea
                id="coverLetter"
                placeholder="Tell the employer why you're a great fit..."
                className="min-h-[150px] border-black"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-black px-6 pt-6">
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <p className="my-4 text-right text-sm text-gray-500">Job ID: {jobId}</p>
    </div>
  );
}
