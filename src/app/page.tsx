import HeaderSearchForm from "@/components/Home/HeaderSearchForm";
import OffersOfTheDay from "@/components/Home/OffersOfTheDay";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";
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
      <OffersOfTheDay />
    </main>
  );
}
