import BackButton from "@/components/Jobs/BackButton";
import React from "react";

const page = () => {
    return (
        <div className="flex flex-col container my-4">
            <BackButton />

            <h1 className="text-3xl font-semibold mt-4">Register Company</h1>
        </div>
    );
};

export default page;
