"use client";

import { useJobSearch } from "@/hooks/useJobSearch";
import { MapPin, Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";

const HeaderSearchForm = () => {
    const { params, updateParams } = useJobSearch();

    const [searchQuery, setSearchQuery] = useState(params.query || "");
    const [locationQuery, setLocationQuery] = useState(params.location || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams(
            {
                query: searchQuery.trim().replace(/\s+/g, " "),
                location: locationQuery,
                page: 1,
            },
            "/jobs",
        );
    };

    return (
        <form
            onSubmit={handleSearch}
            className="container mx-auto flex flex-col gap-4 sm:w-[640px] md:flex-row"
        >
            <div className="border-input focus-within:ring-ring flex flex-grow items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus-within:ring-1">
                <Search className="text-muted-foreground h-5 w-5" />
                <input
                    type="text"
                    placeholder="Job title or employer"
                    className="w-full bg-transparent focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="border-input focus-within:ring-ring flex w-full items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus-within:ring-1 md:w-1/3">
                <MapPin className="text-muted-foreground h-5 w-5" />
                <input
                    type="text"
                    placeholder="Location"
                    className="w-full bg-transparent focus:outline-none"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                />
            </div>

            <Button variant={"destructive"} type="submit">
                Search
            </Button>
        </form>
    );
};

export default HeaderSearchForm;
