import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SearchBox from './components/SearchBox';
import PromoSection from './components/PromoSection';
import Footer from './components/Footer';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow flex flex-col">
        <HeroSection />
        
        {/* The SearchBox overlaps the HeroSection using negative margin */}
        <SearchBox />
        
        <PromoSection />
      </main>

      <Footer />
    </div>
  );
}
