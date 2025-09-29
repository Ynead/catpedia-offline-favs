import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import BreedCard from "@/components/BreedCard";
import { Loader2 } from "lucide-react";

interface CatBreed {
  id: string;
  name: string;
  description: string;
  temperament?: string;
  reference_image_id?: string;
}

const fetchBreeds = async (): Promise<CatBreed[]> => {
  const response = await fetch("https://api.thecatapi.com/v1/breeds");
  if (!response.ok) throw new Error("Failed to fetch breeds");
  return response.json();
};

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: breeds, isLoading, error } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
  });

  const filteredBreeds = breeds?.filter((breed) =>
    breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    breed.temperament?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

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

        {filteredBreeds && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBreeds.map((breed) => (
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
            
            {filteredBreeds.length === 0 && (
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
