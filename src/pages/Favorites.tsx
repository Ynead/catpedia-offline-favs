import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import BreedCard from "@/components/BreedCard";
import { Heart, Loader2 } from "lucide-react";
import { offlineStorage } from "@/lib/offlineStorage";

interface CatBreed {
  id: string;
  name: string;
  description: string;
  temperament?: string;
  reference_image_id?: string;
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

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const { data: breeds, isLoading } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
  });

  useEffect(() => {
    const loadFavorites = () => {
      const favorites = JSON.parse(localStorage.getItem("catpedia-favorites") || "[]");
      setFavoriteIds(favorites);
    };

    loadFavorites();

    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener("favorites-updated", handleFavoritesUpdate);
    return () => window.removeEventListener("favorites-updated", handleFavoritesUpdate);
  }, []);

  const favoriteBreeds = breeds?.filter((breed) => favoriteIds.includes(breed.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Favorites
          </h1>
          <p className="text-muted-foreground text-lg">
            {favoriteIds.length === 0
              ? "You haven't added any favorites yet"
              : `${favoriteIds.length} favorite ${favoriteIds.length === 1 ? "breed" : "breeds"}`}
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && favoriteBreeds && favoriteBreeds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteBreeds.map((breed) => (
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
        )}

        {!isLoading && favoriteIds.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              Start exploring breeds and add them to your favorites!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
