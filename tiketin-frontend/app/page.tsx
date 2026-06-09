import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import PromoSection from "./components/PromoSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <PromoSection />
      </main>
      <Footer />
    </div>
  );
}
