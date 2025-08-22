import Navbar from "./Components/Navbar";
import FindConnection from "./Components/FindConnection";
import ContactUs from "./Components/ContactUs";

interface City {
  id: number;
  name: string;
  imageUrl: string;
}

async function getCities() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/cities`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) {
      console.error("Failed to fetch city list.");
      return { cities: [], error: "Could not load city data." };
    }
    const citiesData: City[] = await response.json();
    return { cities: citiesData, error: null };
  } catch (err) {
    console.error(err);
    return {
      cities: [],
      error: "An network error occurred while fetching cities.",
    };
  }
}

export default async function Home() {
  const { cities, error } = await getCities();

  let initialFromCity = "";
  let initialToCity = "";

  if (cities && cities.length >= 2) {
    initialFromCity =
      cities.find((c) => c.name === "Bengaluru")?.name || cities[0].name;
    initialToCity =
      cities.find((c) => c.name === "Delhi")?.name || cities[1].name;
  } else if (cities && cities.length > 0) {
    initialFromCity = cities[0].name;
  }

  return (
    <div className="bg-black">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <FindConnection
          initialCities={cities}
          initialFromCity={initialFromCity}
          initialToCity={initialToCity}
        />
      </main>
      <ContactUs />
    </div>
  );
}
