import { getJobApplicationById } from "@/db/queries/job-applications";
import { getSignedResumeUrl } from "@/utils/supabase/storage-server";
import { Download, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/Companies/Applications/ActionButtons";
import StatusBadge from "@/components/Companies/Applications/StatusBadge";
import { getUserAvatarUrl } from "@/db/queries/users";

interface JobApplicationPageProps {
    params: Promise<{
        companyId: string;
        offerId: string;
        applicationId: string;
    }>;
}

const JobApplicationPage = async ({ params }: JobApplicationPageProps) => {
    const { companyId, offerId, applicationId } = await params;
    const application = await getJobApplicationById(applicationId);

    if (!application) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">Application Not Found</h1>
                    <p className="text-gray-600 mb-4">The job application you're looking for doesn't exist.</p>
                    <Link href={`/companies/${companyId}/jobs/${offerId}/applications`}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Applications
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const avatarUrl = await getUserAvatarUrl(application.userId);
    const resumeUrl = await getSignedResumeUrl(application.id);

    return (
        <div className="w-full mx-auto space-y-6">
            <div className="border rounded-xl shadow-sm bg-white p-6 space-y-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        {avatarUrl && (
                            <div className="relative">
                                <Image
                                    alt="Applicant Avatar"
                                    src={avatarUrl}
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-semibold mb-1">
                                {application.fullName}
                            </h1>
                            <p className="text-gray-600">Job Application</p>
                        </div>
                    </div>

                    <StatusBadge status={application.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Contact Information</h2>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium text-gray-600">Email:</span>{" "}
                                <a
                                    href={`mailto:${application.email}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {application.email}
                                </a>
                            </p>
                            {application.phoneNumber && (
                                <p>
                                    <span className="font-medium text-gray-600">Phone:</span>{" "}
                                    <a
                                        href={`tel:${application.phoneNumber}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {application.phoneNumber}
                                    </a>
                                </p>
                            )}
                            {application.linkedInUrl && (
                                <p>
                                    <span className="font-medium text-gray-600">LinkedIn:</span>{" "}
                                    <Link
                                        href={application.linkedInUrl}
                                        target="_blank"
                                        className="text-blue-600 hover:underline inline-flex items-center"
                                    >
                                        View Profile
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Application Details</h2>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium text-gray-600">Applied:</span>{" "}
                                {new Date(application.appliedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            {resumeUrl && (
                                <div>
                                    <span className="font-medium text-gray-600">Resume:</span>{" "}
                                    <Link
                                        href={resumeUrl.signedUrl}
                                        target="_blank"
                                        className="text-blue-600 hover:underline inline-flex items-center"
                                    >
                                        <Download className="mr-1 h-4 w-4" />
                                        Download Resume
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {application.coverLetter && (
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Cover Letter</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="whitespace-pre-line text-gray-800 leading-relaxed">
                                {application.coverLetter}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {application.education && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800">Education</h3>
                            <p className="text-gray-800">{application.education}</p>
                        </div>
                    )}

                    {application.locationPreference && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800">Location Preference</h3>
                            <p className="text-gray-800">{application.locationPreference}</p>
                        </div>
                    )}
                </div>

                {application?.skills?.length && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {application.skills.map((skill: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-50 border border-gray-300 text-gray-800 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                    <ActionButtons
                        applicationId={application.id}
                        currentStatus={application.status}
                    />
                </div>
            </div>
        </div>
    );
};

export default JobApplicationPage;