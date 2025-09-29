import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface BreedDetail {
  id: string;
  name: string;
  description: string;
  temperament?: string;
  origin?: string;
  life_span?: string;
  weight?: {
    metric: string;
  };
  wikipedia_url?: string;
  affection_level?: number;
  energy_level?: number;
  intelligence?: number;
  social_needs?: number;
  child_friendly?: number;
  dog_friendly?: number;
}

const fetchBreedDetail = async (id: string): Promise<BreedDetail> => {
  const response = await fetch(`https://api.thecatapi.com/v1/breeds/${id}`);
  if (!response.ok) throw new Error("Failed to fetch breed details");
  return response.json();
};

const fetchBreedImages = async (breedId: string) => {
  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=3`
  );
  if (!response.ok) throw new Error("Failed to fetch breed images");
  return response.json();
};

const StatBar = ({ label, value }: { label: string; value?: number }) => {
  if (value === undefined) return null;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/5</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

const BreedDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: breed, isLoading: breedLoading, error: breedError } = useQuery({
    queryKey: ["breed", id],
    queryFn: () => fetchBreedDetail(id!),
    enabled: !!id,
  });

  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ["breedImages", id],
    queryFn: () => fetchBreedImages(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (id) {
      const favorites = JSON.parse(localStorage.getItem("catpedia-favorites") || "[]");
      setIsFavorite(favorites.includes(id));
    }
  }, [id]);

  const toggleFavorite = () => {
    if (!id) return;
    
    const favorites = JSON.parse(localStorage.getItem("catpedia-favorites") || "[]");
    const newFavorites = isFavorite
      ? favorites.filter((fav: string) => fav !== id)
      : [...favorites, id];
    
    localStorage.setItem("catpedia-favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    window.dispatchEvent(new CustomEvent("favorites-updated"));
  };

  if (breedLoading || imagesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (breedError || !breed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-destructive mb-4">Failed to load breed details</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Breeds
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            {images && images[0] && (
              <Card className="overflow-hidden">
                <img
                  src={images[0].url}
                  alt={breed.name}
                  className="w-full aspect-square object-cover"
                />
              </Card>
            )}
            {images && images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 3).map((img: any, idx: number) => (
                  <Card key={idx} className="overflow-hidden">
                    <img
                      src={img.url}
                      alt={`${breed.name} ${idx + 2}`}
                      className="w-full aspect-square object-cover"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-4xl font-bold">{breed.name}</h1>
                <Button
                  size="lg"
                  variant={isFavorite ? "default" : "outline"}
                  onClick={toggleFavorite}
                  className="gap-2"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Favorited" : "Add to Favorites"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {breed.origin && <Badge variant="secondary">{breed.origin}</Badge>}
                {breed.life_span && (
                  <Badge variant="outline">{breed.life_span} years</Badge>
                )}
                {breed.weight && (
                  <Badge variant="outline">{breed.weight.metric} kg</Badge>
                )}
              </div>

              <p className="text-foreground/80 leading-relaxed">{breed.description}</p>
            </div>

            {breed.temperament && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Temperament</h3>
                  <div className="flex flex-wrap gap-2">
                    {breed.temperament.split(", ").map((trait) => (
                      <Badge key={trait} variant="secondary">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold mb-4">Characteristics</h3>
                <StatBar label="Affection Level" value={breed.affection_level} />
                <StatBar label="Energy Level" value={breed.energy_level} />
                <StatBar label="Intelligence" value={breed.intelligence} />
                <StatBar label="Social Needs" value={breed.social_needs} />
                <StatBar label="Child Friendly" value={breed.child_friendly} />
                <StatBar label="Dog Friendly" value={breed.dog_friendly} />
              </CardContent>
            </Card>

            {breed.wikipedia_url && (
              <Button variant="outline" asChild className="w-full">
                <a href={breed.wikipedia_url} target="_blank" rel="noopener noreferrer">
                  Learn More on Wikipedia
                </a>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BreedDetail;
