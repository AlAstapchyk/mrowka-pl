import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = async ({
    params,
}: {
    params: Promise<{ companyId: string, offerId: string }>;
}) => {
    const resolvedParams = await params;
    const companyId = resolvedParams.companyId;
    const offerId = resolvedParams.offerId;

    return (
        <div className="container flex flex-col items-center justify-center gap-4 m-auto">
            <Button className="w-full max-w-xl flex justify-center" variant={"outline"} asChild>
                <Link href={`/companies/${companyId}/offers/${offerId}/edit`}>
                    Edit
                </Link>
            </Button>

            <Button className="w-full max-w-xl flex justify-center" variant={"outline"} asChild>
                <Link href={`/companies/${companyId}/offers/${offerId}/applications`}>
                    Applications
                </Link>
            </Button>
        </div>
    );
};

export default page;
