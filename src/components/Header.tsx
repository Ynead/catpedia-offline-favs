import { Link, useLocation } from "react-router-dom";
import { Heart, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Catpedia
          </span>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Button
            variant={location.pathname === "/" ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button
            variant={location.pathname === "/favorites" ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/favorites">
              <Heart className="mr-2 h-4 w-4" />
              Favorites
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
