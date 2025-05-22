'use client';

import React, { useState } from 'react';
import { useJobSearch } from '@/hooks/useJobSearch';
import { useJobDataFetch } from '@/hooks/useJobDataFetch';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

const JobSearch = () => {
    const { params, updateParams } = useJobSearch();
    const { totalCount } = useJobDataFetch();

    const [searchQuery, setSearchQuery] = useState(params.query || '');
    const [locationQuery, setLocationQuery] = useState(params.location || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({
            query: searchQuery.trim().replace(/\s+/g, " "),
            location: locationQuery,
            page: 1 // Reset to page 1 when initiating a new search
        });
    };

    const handleSortChange = (value: string) => {
        const sortDirection = value as "asc" | "desc";
        updateParams({ sortDirection });
    };

    const handlePageSizeChange = (value: string) => {
        updateParams({
            pageSize: Number(value),
            page: 1 // Reset to page 1 when changing page size
        });
    };

    return (
        <div className="space-y-4 w-full">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
                <div className="flex items-center gap-2 flex-grow border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Job title or employer"
                        className="bg-transparent focus:outline-none w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-1/3 border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Location"
                        className="bg-transparent focus:outline-none w-full"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                    />
                </div>

                <Button type="submit">Search</Button>
            </form>

            <div className="flex gap-4">
                <div className='flex font-serif gap-1.5 items-center'>
                    <b>{totalCount}</b> job offers found
                </div>

                <div className='flex gap-4 ml-auto'>
                    <Select
                        value={`${params.pageSize}`}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="w-[120px] cursor-pointer">
                            <SelectValue placeholder="Offers on the page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className='cursor-pointer' value="5">5</SelectItem>
                            <SelectItem className='cursor-pointer' value="10">10</SelectItem>
                            <SelectItem className='cursor-pointer' value="20">20</SelectItem>
                            <SelectItem className='cursor-pointer' value="50">50</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={`${params.sortDirection}`}
                        onValueChange={handleSortChange}
                    >
                        <SelectTrigger className="w-[180px] cursor-pointer">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className='cursor-pointer' value="desc">Newest first</SelectItem>
                            <SelectItem className='cursor-pointer' value="asc">Oldest first</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default JobSearch;