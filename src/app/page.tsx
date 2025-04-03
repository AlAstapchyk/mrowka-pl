import Header from "@/components/Home/Header";
import OffersOfTheDay from "@/components/Home/OffersOfTheDay";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Header />
      <OffersOfTheDay />
    </main>
  );
}
