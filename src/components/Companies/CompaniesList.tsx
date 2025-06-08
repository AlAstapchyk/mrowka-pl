"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Company } from "@/db/schema";
import Image from "next/image";

export default function CompaniesListClient({ companies }: { companies: { company: Company; role: string }[] }) {
    const [logos, setLogos] = useState<Record<string, string | undefined>>({});
    const [isFetching, setIsFetching] = useState<boolean>(true);

    useEffect(() => {
        async function fetchLogos() {
            setIsFetching(true);
            const logoMap: Record<string, string | undefined> = {};
            for (const company of companies) {
                const logoUrl = company.company.logoUrl;
                logoMap[company.company.id] = logoUrl ?? undefined;
            }
            setLogos(logoMap);
            setIsFetching(false);
        }
        fetchLogos();
    }, [companies]);

    return (
        <div className="gap-4 grid">
            {companies.map((item, idx) => (
                <Link
                    key={idx}
                    href={`/companies/${item.company.id}`}
                    className="flex flex-col rounded-xl border-[1px] border-gray-700 p-4 transition-colors hover:bg-gray-100"
                >
                    <div className="flex gap-3">
                        {isFetching ?
                            <div className="animate-pulse">
                                <div className="bg-gray-200 rounded w-12 h-12"></div>
                            </div>
                            :
                            logos[item.company.id] ? (
                                <Image
                                    width={48}
                                    height={48}
                                    src={`${item.company.logoUrl}?v=${new Date().getTime()}`}
                                    alt={`${item.company.name} logo`}
                                    className="h-12 w-12 rounded-xl object-cover"
                                />
                            ) : (
                                <Building2 width={48} height={48} />
                            )
                        }
                        { }

                        <div className="flex flex-col justify-center">
                            <span className="font-semibold">{item.company.name}</span>
                            <span className="text-sm text-gray-600 capitalize">{item.role}</span> {/* Show role here */}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
