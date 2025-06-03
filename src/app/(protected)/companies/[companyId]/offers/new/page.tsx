import CreateJobOfferForm from "@/components/Companies/JobOffers/CreateJobOfferForm";
import React from "react";

const page = () => {
    return (
        <div className="flex flex-col">
            <h1 className="text-3xl font-semibold mb-6">Create new job offer</h1>

            <CreateJobOfferForm />
        </div>
    );
};

export default page;
