"use client";

import {
    Breadcrumb,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { isUuid } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

export interface RouteSegment {
    segment?: string;
    label: string;
    href: (companyId: string) => string;
}

const baseSegments = (
    companyName: string,
    companyId: string
): RouteSegment[] => [
        { segment: "home", label: "Home", href: () => "/" },
        { segment: "companies", label: "Companies", href: () => "/companies" },
        {
            segment: "company",
            label: companyName,
            href: () => `/companies/${companyId}`,
        },
    ];

const breadcrumbMap = new Map<string, RouteSegment>([
    [
        "companies",
        { segment: "companies", label: "Companies", href: () => `/companies` },
    ],
    [
        "edit",
        {
            segment: "edit",
            label: "Edit Company",
            href: (companyId) => `/companies/${companyId}/edit`,
        },
    ],
    [
        "offers",
        {
            segment: "offers",
            label: "Offers",
            href: (companyId) => `/companies/${companyId}/offers`,
        },
    ],
    [
        "new",
        {
            segment: "new",
            label: "New Offer",
            href: (companyId) => `/companies/${companyId}/offers/new`,
        },
    ],
    [
        "analytics",
        {
            segment: "analytics",
            label: "Analytics",
            href: (companyId) => `/companies/${companyId}/analytics`,
        },
    ],
    [
        "settings",
        {
            segment: "settings",
            label: "Settings",
            href: (companyId) => `/companies/${companyId}/settings`,
        },
    ],
    [
        "members",
        {
            segment: "members",
            label: "Members",
            href: (companyId) => `/companies/${companyId}/members`,
        },
    ],
]);

// Caches for job titles and application labels
const jobTitleCache = new Map<string, string>();
const applicationLabelCache = new Map<string, string>();

export default function ClientBreadcrumbs({
    companyId,
    companyName,
}: {
    companyId: string;
    companyName: string;
}) {
    const pathname = usePathname();
    const [breadcrumbSegments, setBreadcrumbSegments] = useState<RouteSegment[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);

    // Fetch or return job title from cache
    const getJobTitle = useCallback(async (jobId: string): Promise<string> => {
        if (jobTitleCache.has(jobId)) {
            return jobTitleCache.get(jobId)!;
        }
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs/${jobId}/title`
            );
            const title = res.data?.title || "Offer";
            jobTitleCache.set(jobId, title);
            return title;
        } catch (error) {
            console.error(`Error fetching job offer title for ID ${jobId}:`, error);
            jobTitleCache.set(jobId, "Offer (Not Found)");
            return "Offer (Not Found)";
        }
    }, []);

    // Fetch or return application label from cache
    const getJobApplicationFullName = useCallback(
        async (appId: string): Promise<string> => {
            if (applicationLabelCache.has(appId)) {
                return applicationLabelCache.get(appId)!;
            }
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SITE_URL}/api/job-applications/${appId}/full-name`
                );
                const label = res.data?.fullName || "Application";
                applicationLabelCache.set(appId, label);
                return label;
            } catch (error) {
                console.error(
                    `Error fetching application label for ID ${appId}:`,
                    error
                );
                applicationLabelCache.set(appId, "Application");
                return "Application";
            }
        }, []
    );

    useEffect(() => {
        const buildBreadcrumbs = async () => {
            setIsLoading(true);
            try {
                const pathParts = pathname.split("/").filter(Boolean);
                const companyIndex = pathParts.findIndex((part) => part === companyId);
                const currentBaseSegments = baseSegments(companyName, companyId);

                if (companyIndex !== -1) {
                    const dynamicPathSegments = pathParts.slice(companyIndex + 1);

                    const routeSegmentsPromises = dynamicPathSegments.map(
                        async (segment, idx) => {
                            if (breadcrumbMap.has(segment)) {
                                return breadcrumbMap.get(segment)!;
                            }

                            if (segment === "applications") {
                                const offerIdForApps = dynamicPathSegments[idx - 1];
                                if (isUuid(offerIdForApps)) {
                                    return {
                                        segment: "applications",
                                        label: "Applications",
                                        href: (currentCompanyId: string) =>
                                            `/companies/${currentCompanyId}/offers/${offerIdForApps}/applications`,
                                    };
                                }
                            }

                            if (segment === "edit") {
                                const prev = dynamicPathSegments[idx - 1];
                                const prev2 = dynamicPathSegments[idx - 2];
                                if (isUuid(prev) && prev2 === "offers") {
                                    return {
                                        segment: "edit",
                                        label: "Edit Offer",
                                        href: (currentCompanyId: string) =>
                                            `/companies/${currentCompanyId}/offers/${prev}/edit`,
                                    };
                                }
                            }

                            if (isUuid(segment)) {
                                const prev = dynamicPathSegments[idx - 1];
                                const prev2 = dynamicPathSegments[idx - 2];

                                if (prev === "offers") {
                                    const jobTitle = await getJobTitle(segment);
                                    return {
                                        segment,
                                        label: jobTitle,
                                        href: (currentCompanyId: string) =>
                                            `/companies/${currentCompanyId}/offers/${segment}`,
                                    };
                                }

                                if (prev === "applications" && isUuid(prev2 || "")) {
                                    const offerIdForApp = prev2;
                                    const appLabel = await getJobApplicationFullName(segment);
                                    return {
                                        segment,
                                        label: appLabel,
                                        href: (currentCompanyId: string) =>
                                            `/companies/${currentCompanyId}/offers/${offerIdForApp}/applications/${segment}`,
                                    };
                                }
                            }
                        }
                    );

                    const resolvedRouteSegments = await Promise.all(
                        routeSegmentsPromises
                    );
                    const validSegments = resolvedRouteSegments.filter(
                        (s): s is RouteSegment => s !== null
                    );

                    setBreadcrumbSegments([
                        ...currentBaseSegments,
                        ...validSegments,
                    ]);
                } else {
                    setBreadcrumbSegments(currentBaseSegments);
                }
            } catch (error) {
                console.error("Error building breadcrumbs:", error);
                setBreadcrumbSegments(baseSegments(companyName, companyId));
            } finally {
                setIsLoading(false);
            }
        };

        buildBreadcrumbs();
    }, [pathname, companyId, companyName, getJobTitle, getJobApplicationFullName]);

    if (isLoading && breadcrumbSegments.length === 0) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <div className="animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-48"></div>
                    </div>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbSegments.map((segment, index) => {
                    const isLast = index === breadcrumbSegments.length - 1;
                    return (
                        <React.Fragment key={segment.segment || index}>
                            <BreadcrumbLink
                                asChild={!isLast}
                                className={isLast ? "text-gray-900 font-medium" : ""}
                            >
                                {!isLast ? (
                                    <Link
                                        href={segment.href(companyId)}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {segment.label}
                                    </Link>
                                ) : (
                                    <span className="text-sm">{segment.label}</span>
                                )}
                            </BreadcrumbLink>
                            {index < breadcrumbSegments.length - 1 && (
                                <BreadcrumbSeparator className="text-gray-400" />
                            )}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
