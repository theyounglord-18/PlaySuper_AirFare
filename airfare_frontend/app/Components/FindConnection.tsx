"use client";
import React, { useState, useCallback } from "react";
import { Plane, Search, Clock, IndianRupee, Loader2 } from "lucide-react";
import Image from "next/image";
import ResultsSkeleton from "./ResultsSkeleton";
import NoResultsFound from "./NoResultsFound";
import SearchError from "./SearchError";

interface City {
  id: number;
  name: string;
  imageUrl: string;
}
interface Connection {
  id: number;
  fromCity: string;
  toCity: string;
  duration: number;
  airfare: number;
}
interface ApiResponse {
  connections: Connection[];
  fromCityImage: string;
  toCityImage: string;
}
interface NoConnectionResponse {
  message: string;
}
interface FindConnectionProps {
  initialCities: City[];
  initialFromCity: string;
  initialToCity: string;
}

const FindConnection: React.FC<FindConnectionProps> = ({
  initialCities,
  initialFromCity,
  initialToCity,
}) => {
  const [cities] = useState<City[]>(initialCities || []);
  const [fromCity, setFromCity] = useState<string>(initialFromCity || "");
  const [toCity, setToCity] = useState<string>(initialToCity || "");
  const [filterBy, setFilterBy] = useState<string>("Fastest");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    setData(null);
    setNoResults(false);
    setSearchError(null);
    if (!fromCity || !toCity) {
      setSearchError("Please select both departure and destination cities.");
      return;
    }
    if (fromCity === toCity) {
      setSearchError("Departure and destination cities cannot be the same.");
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_BACKEND_API +
        `/user-search/search?fromCity=${fromCity}&toCity=${toCity}&fliterBy=${filterBy}`;
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw new Error(
          `The flight network is currently unavailable. Please try again later.`
        );

      const result: ApiResponse | NoConnectionResponse = await response.json();
      if (
        "message" in result ||
        ("connections" in result && result.connections.length === 0)
      ) {
        setNoResults(true);
      } else if ("connections" in result) {
        setData(result);
      }
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, [fromCity, toCity, filterBy]);

  const renderSelect = (
    id: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  ) => (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-900/70 border border-slate-700 text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
    >
      {cities.map((city) => (
        <option
          key={`${id}-${city.id}`}
          value={city.name}
          className="bg-slate-800 text-white"
        >
          {city.name}
        </option>
      ))}
    </select>
  );

  return (
    <section
      id="find-flight"
      className="relative min-h-screen flex items-center justify-center p-2 sm:p-4 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop"
          alt="Airplane in the sky"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full animate-fade-in-up">
        <div className="bg-black/30 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-2xl border border-white/10">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl m:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Find Your Perfect Flight
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base lg:text-lg">
              Your journey begins with a single search.
            </p>
          </div>

          {searchError && (
            <SearchError
              message={searchError}
              onClose={() => setSearchError(null)}
            />
          )}

          <div
            suppressHydrationWarning
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end"
          >
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-white text-sm font-medium mb-2">
                From
              </label>
              {renderSelect("fromCity", fromCity, (e) =>
                setFromCity(e.target.value)
              )}
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-white text-sm font-medium mb-2">
                To
              </label>
              {renderSelect("toCity", toCity, (e) => setToCity(e.target.value))}
            </div>

            <div className="sm:col-span-1 lg:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Filter
              </label>
              <div className="flex items-center bg-slate-900/70 border border-slate-700 rounded-lg p-1">
                {["Fastest", "Cheapest"].map((option) => (
                  <label
                    key={option}
                    className={`flex-1 text-center cursor-pointer p-1.5 sm:p-2 rounded-md text-xs sm:text-sm transition-colors duration-300 ${
                      filterBy === option
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="filter"
                      value={option}
                      checked={filterBy === option}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="sm:col-span-1 lg:col-span-2">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-blue-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 text-sm sm:text-base mt-4 sm:mt-6"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                )}
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center text-white text-lg mt-6 sm:mt-8">
            <ResultsSkeleton />
          </div>
        )}
        {noResults && (
          <div className="text-center text-amber-400 text-lg mt-6 sm:mt-8">
            <NoResultsFound />
          </div>
        )}

        {data && (
          <div
            className="mt-6 sm:mt-8 lg:mt-10 space-y-4 sm:space-y-6 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="bg-black/30 backdrop-blur-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
                <div className="text-center">
                  <div className="relative w-full h-24 sm:h-32 rounded-lg overflow-hidden mb-2 sm:mb-3">
                    <Image
                      src={data.fromCityImage}
                      alt={`${fromCity} cityscape`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {fromCity}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm">Departure</p>
                </div>

                <div className="flex justify-center order-last sm:order-none">
                  <div className="bg-blue-600 p-3 sm:p-4 rounded-full">
                    <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="relative w-full h-24 sm:h-32 rounded-lg overflow-hidden mb-2 sm:mb-3">
                    <Image
                      src={data.toCityImage}
                      alt={`${toCity} cityscape`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {toCity}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Destination
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {data.connections.map((conn) => (
                <div
                  key={conn.id}
                  className="bg-black/30 backdrop-blur-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 hover:border-blue-500/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-center mb-3 sm:mb-4 text-lg sm:text-2xl font-bold text-white">
                    <span className="truncate">{conn.fromCity}</span>
                    <Plane className="text-blue-400 mx-2 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="truncate">{conn.toCity}</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 sm:p-3 rounded-lg">
                      <span className="flex items-center font-medium text-slate-300 text-sm sm:text-base">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-slate-400" />
                        Duration
                      </span>
                      <span className="font-semibold text-white text-sm sm:text-base">
                        {conn.duration} hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 sm:p-3 rounded-lg">
                      <span className="flex items-center font-medium text-slate-300 text-sm sm:text-base">
                        <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-slate-400" />
                        Airfare
                      </span>
                      <span className="font-semibold text-white text-sm sm:text-base">
                        ₹{conn.airfare.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FindConnection;
