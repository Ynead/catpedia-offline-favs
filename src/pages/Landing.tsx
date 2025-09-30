import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterBar, { SortOption } from "@/components/FilterBar";
import BreedCard from "@/components/BreedCard";
import { Loader2 } from "lucide-react";
import { offlineStorage } from "@/lib/offlineStorage";

interface CatBreed {
  id: string;
  name: string;
  description: string;
  temperament?: string;
  reference_image_id?: string;
  affection_level?: number;
  energy_level?: number;
  intelligence?: number;
  social_needs?: number;
}

const BREEDS_CACHE_KEY = "catpedia-breeds-cache";

const fetchBreeds = async (): Promise<CatBreed[]> => {
  const cached = offlineStorage.get<CatBreed[]>(BREEDS_CACHE_KEY);
  
  try {
    const response = await fetch("https://api.thecatapi.com/v1/breeds");
    if (!response.ok) throw new Error("Failed to fetch breeds");
    const data = await response.json();
    offlineStorage.set(BREEDS_CACHE_KEY, data);
    return data;
  } catch (error) {
    if (cached) {
      console.log("Using cached data (offline mode)");
      return cached;
    }
    throw error;
  }
};

const sortBreeds = (breeds: CatBreed[], sortBy: SortOption): CatBreed[] => {
  if (sortBy === "none") return breeds;

  const sorted = [...breeds];
  
  switch (sortBy) {
    case "affection-high":
      return sorted.sort((a, b) => (b.affection_level || 0) - (a.affection_level || 0));
    case "affection-low":
      return sorted.sort((a, b) => (a.affection_level || 0) - (b.affection_level || 0));
    case "energy-high":
      return sorted.sort((a, b) => (b.energy_level || 0) - (a.energy_level || 0));
    case "energy-low":
      return sorted.sort((a, b) => (a.energy_level || 0) - (b.energy_level || 0));
    case "intelligence-high":
      return sorted.sort((a, b) => (b.intelligence || 0) - (a.intelligence || 0));
    case "intelligence-low":
      return sorted.sort((a, b) => (a.intelligence || 0) - (b.intelligence || 0));
    case "social-high":
      return sorted.sort((a, b) => (b.social_needs || 0) - (a.social_needs || 0));
    case "social-low":
      return sorted.sort((a, b) => (a.social_needs || 0) - (b.social_needs || 0));
    default:
      return sorted;
  }
};

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("none");
  
  const { data: breeds, isLoading, error } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
  });

  const filteredBreeds = breeds?.filter((breed) =>
    breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    breed.temperament?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBreeds = filteredBreeds ? sortBreeds(filteredBreeds, sortBy) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Discover Cat Breeds
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore the wonderful world of feline friends
          </p>
        </div>

        <FilterBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-destructive">
            Failed to load cat breeds. Please try again later.
          </div>
        )}

        {sortedBreeds && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedBreeds.map((breed) => (
                <BreedCard
                  key={breed.id}
                  id={breed.id}
                  name={breed.name}
                  image={breed.reference_image_id ? `https://cdn2.thecatapi.com/images/${breed.reference_image_id}.jpg` : undefined}
                  description={breed.description}
                  temperament={breed.temperament}
                />
              ))}
            </div>
            
            {sortedBreeds.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No breeds found matching your search.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Landing;
