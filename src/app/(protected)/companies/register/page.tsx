import RegisterCompanyForm from "@/components/Companies/RegisterCompanyForm";
import BackButton from "@/components/Jobs/BackButton";
import React from "react";

const page = () => {
    return (
        <div className="flex flex-col container my-4">
            <BackButton />

            <h1 className="text-3xl font-semibold my-4">Register Company</h1>

            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-800">
                    <strong>Note:</strong> You will be automatically added as the company admin.
                    You can invite other team members later.
                </p>
            </div>

            <RegisterCompanyForm />
        </div>
    );
};

export default page;
