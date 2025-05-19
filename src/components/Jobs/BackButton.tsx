"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackButton = () => {
    const router = useRouter();

    const handleBack = () => {
        const referrer = document.referrer;

        // If referrer is from the same domain, go back
        if (referrer && new URL(referrer).origin === window.location.origin) {
            router.back();
        } else router.push("/");
    };

    return (
        <Button
            variant="outline"
            className="border-black hover:bg-gray-100 flex size-fit"
            onClick={handleBack}
        >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
        </Button>
    );
};

export default BackButton;
