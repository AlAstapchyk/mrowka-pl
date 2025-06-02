import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = async ({
    params,
}: {
    params: Promise<{ companyId: string }>;
}) => {
    const companyId = (await params).companyId;

    return (
        <div className="container flex flex-col items-center justify-center gap-4 m-auto">
            <Button className="w-full max-w-xl flex justify-center" variant={"outline"} asChild>
                <Link href={`/companies/${companyId}/update`}>
                    Update company
                </Link>
            </Button>

            <Button className="w-full max-w-xl flex justify-center" variant={"outline"} asChild>
                <Link href={`/companies/${companyId}/members`}>
                    Manage team
                </Link>
            </Button>

            <Button className="w-full max-w-xl flex justify-center" variant={"outline"} asChild>
                <Link href={`/companies/${companyId}/offers`}>
                    Manage offers
                </Link>
            </Button>

            <Button className="w-full max-w-xl flex justify-center" variant={"outline"} asChild>
                <Link href={`/companies/${companyId}/analytics`}>
                    View analytics
                </Link>
            </Button>

            <Button className="w-full max-w-xl flex justify-center" variant={"outline"} asChild>
                <Link href={`/companies/${companyId}/settings`}>
                    Company settings
                </Link>
            </Button>
        </div>
    );
};

export default page;
