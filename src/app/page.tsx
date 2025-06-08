import HeaderSearchForm from "@/components/Home/HeaderSearchForm";
import RecentJobs from "@/components/Home/RecentJobs";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex flex-col">

      <div className="relative h-[400px] w-full">
        <Image
          src="/home-bg.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        <div className="absolute inset-0 flex flex-col bg-black/75 px-2 py-24">
          <p className="mx-auto mb-4 text-3xl font-medium text-white">
            Searching for a job?
          </p>
          <p className="mx-auto mb-8 text-2xl font-medium text-white">
            Find with us!
          </p>

          <Suspense fallback={<LoadingSpinner />}>
            <HeaderSearchForm />
          </Suspense>

        </div>
      </div>
      <RecentJobs />

      <section className="py-12 mb-8 mt-2 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through mrowka.pl
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-black hover:bg-gray-200">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>

            <Button asChild variant="outline" className="text-black hover:bg-gray-200 hover:text-black">
              <Link href="/profile">Upload CV</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
