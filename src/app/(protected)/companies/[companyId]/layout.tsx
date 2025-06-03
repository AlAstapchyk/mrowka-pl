import ClientBreadcrumbs from "@/components/Companies/ClientBreadcrumbs";
import { getCompanyById } from "@/db/queries/companies";
import { notFound } from "next/navigation";
import React from "react";

const Layout = async ({ children, params }: { children: React.ReactNode, params: Promise<{ companyId: string }> }) => {
    const resolvedParams = await params;
    const { companyId } = resolvedParams;

    if (!companyId) return notFound();

    try {
        const company = await getCompanyById(companyId);
        if (!company) return notFound();

        return (
            <div className="flex flex-col">
                <header className="w-full border-b border-gray-200 bg-white shadow-sm">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-4 py-3">
                            <div className="flex items-center gap-3">
                                {company.logoUrl ? (
                                    <img src={company.logoUrl} alt={`${company.name} logo`} width={32} height={32} className="rounded-md object-contain" />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-300 rounded-md flex items-center justify-center">
                                        <span className="text-gray-600 text-sm font-medium">{company.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                                <div>
                                    <h1 className="font-semibold text-gray-900">{company.name}</h1>
                                </div>
                            </div>
                        </div>

                        <div className="pb-3">
                            <ClientBreadcrumbs companyId={companyId} companyName={company.name} />
                        </div>
                    </div>
                </header>

                <main className="container mx-auto my-4">
                    {children}
                </main>
            </div>
        );
    } catch (error) {
        console.error("Error loading company:", error);
        return notFound();
    }
};

export default Layout;
