import { Button } from "@/components/ui/button";
import { getCompanies } from "@/db/queries/companies";
import Link from "next/link";
import React from "react";

const page = async () => {
    const companies = await getCompanies();
    return (
        <div className="container my-4 ">
            <div className="flex mb-4">
                <h2 className="text-2xl font-semibold mb-4">Companies you have access to</h2>
                <Button className="felx ml-auto bg-black text-white hover:bg-gray-800" variant={"default"} asChild>
                    <Link href={"companies/register"}>
                        Register Company
                    </Link>
                </Button>
            </div>
            <div className="gap-4 grid">
                {companies.map((company, idx) => <Link
                    key={idx}
                    href={`/companies/${company.id}`}
                    className="flex flex-col rounded-xl border-[1px] border-gray-700 p-4 transition-colors hover:bg-gray-100"
                >
                    <div className="flex gap-3">
                        <img
                            width={48}
                            height={48}
                            src={company.logoUrl ?? ""}
                            alt={`${company.name} logo`}
                            className="h-12 w-12 rounded-full object-cover"
                        />

                        <div className="flex flex-col justify-center">
                            <span className="font-semibold">{company.name}</span>
                        </div>
                    </div>
                </Link>)}
            </div>
        </div>
    );
};

export default page;
