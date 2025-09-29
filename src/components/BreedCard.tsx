import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface BreedCardProps {
  id: string;
  name: string;
  image?: string;
  description: string;
  temperament?: string;
}

const BreedCard = ({ id, name, image, description, temperament }: BreedCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("catpedia-favorites") || "[]");
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem("catpedia-favorites") || "[]");
    const newFavorites = isFavorite
      ? favorites.filter((fav: string) => fav !== id)
      : [...favorites, id];
    
    localStorage.setItem("catpedia-favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    window.dispatchEvent(new CustomEvent("favorites-updated"));
  };

  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/breed/${id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {image && !imageError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 rounded-full shadow-md hover:scale-110 transition-transform"
            onClick={toggleFavorite}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-1">{name}</h3>
          {temperament && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {temperament}
            </p>
          )}
          <p className="text-sm text-foreground/80 line-clamp-2">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BreedCard;
