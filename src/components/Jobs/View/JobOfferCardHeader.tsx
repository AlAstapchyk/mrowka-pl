"use client"

import React from "react";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const JobOfferCardHeader = ({ jobOffer, alreadyApplied }: { jobOffer: any, alreadyApplied: boolean }) => {
    return (
        <div className="border-b border-black sm:px-6 pb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {jobOffer.logoUrl && (
                        <div className="w-16 h-16 flex items-center justify-center">
                            <img
                                src={jobOffer.logoUrl ?? "Company's logo"}
                                alt={`${jobOffer.companyName} logo`}
                                className="max-w-full max-h-full"
                            />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{jobOffer.title}</h1>
                        <p className="text-gray-700 font-medium">{jobOffer.companyName}</p>
                    </div>

                </div>
                <Button
                    asChild
                    variant="default"
                    className="ml-auto bg-black text-white hover:bg-gray-800 max-sm:hidden"
                >
                    {alreadyApplied ? (
                        <div
                            className="flex items-center gap-2 cursor-not-allowed opacity-50 pointer-events-none"
                            aria-disabled="true"
                        >
                            Already applied
                        </div>
                    ) : (
                        <Link
                            href={`/jobs/apply/${jobOffer.id}`}
                            className="flex items-center gap-2"
                        >
                            <span>Apply</span>
                            <ArrowRight />
                        </Link>
                    )}
                </Button>
            </div>
        </div>);
};

export default JobOfferCardHeader;
