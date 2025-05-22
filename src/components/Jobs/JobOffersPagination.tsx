"use client"

import { useJobSearch } from "@/hooks/useJobSearch";
import { useJobDataFetch } from "@/hooks/useJobDataFetch";
import React from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import JobOfferItem from "./JobOfferItem";

const JobOffersPagination = () => {
    const { params, updateParams } = useJobSearch();
    const { jobOffers, totalCount, isLoading } = useJobDataFetch();

    const currentPage = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalPages = Math.ceil((totalCount ?? 0) / pageSize);

    const handlePageChange = (page: number) => {
        updateParams({ page });
    };

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [1];
        if (totalPages <= 7) {
            for (let i = 2; i < totalPages; i++) pages.push(i);
        } else {
            if (currentPage > 3) pages.push('ellipsis');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('ellipsis');
        }
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    if (isLoading) {
        return <div className="py-8 text-center">Loading job offers...</div>;
    }

    if (jobOffers.length === 0) {
        return <div className="py-8 text-center">No job offers found matching your criteria.</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-4 mb-8">
                {jobOffers.map((item) => (
                    <JobOfferItem
                        key={item.id}
                        jobOffer={item}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination className="mb-8">
                    <PaginationContent>
                        <PaginationItem className="cursor-pointer">
                            <PaginationPrevious
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                aria-disabled={currentPage === 1}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {getPageNumbers().map((page, i) => (
                            <PaginationItem key={i} className="cursor-pointer">
                                {page === 'ellipsis' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        isActive={page === currentPage}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem className="cursor-pointer">
                            <PaginationNext
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                aria-disabled={currentPage === totalPages}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </>
    );
};

export default JobOffersPagination;