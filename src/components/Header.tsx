import { Link, useLocation } from "react-router-dom";
import { Heart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import logo from "@/assets/catpedia_logo.png";

const Header = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-2xl hover:opacity-80 transition-opacity">
          <img src={logo} alt="Catpedia Logo" className="h-10 w-10" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Catpedia
          </span>
        </Link>
        
        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
