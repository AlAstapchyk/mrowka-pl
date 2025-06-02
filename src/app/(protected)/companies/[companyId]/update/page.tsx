import UpdateCompanyForm from "@/components/Companies/UpdateCompanyForm";
import React from "react";

const page = () => {
    return (
        <div className="flex flex-col mb-4">
            <h1 className="text-3xl font-semibold mb-4">Update Company</h1>

            <UpdateCompanyForm />
        </div>
    );
};

export default page;
