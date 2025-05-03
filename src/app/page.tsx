import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ErrorAlert } from "@/components/ErrorAlert";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { InitialLoader } from "@/components/InitialLoader";
import { Providers } from "./providers";
import { SearchBar } from "@/components/UI/SearchBar";
import { WeatherDashboard } from "@/components/Weather/WeatherDashboard";

export default function Home() {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-background/80">
        <InitialLoader />
        <LoadingSpinner />
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            {/* Error alert */}
            <ErrorAlert />

            {/* Search bar */}
            <div className="max-w-md mx-auto w-full mb-4">
              <SearchBar />
            </div>

            {/* Weather Dashboard */}
            <WeatherDashboard />
          </div>
        </main>

        <Footer />
      </div>
    </Providers>
  );
}
