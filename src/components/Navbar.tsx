import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, User } from "lucide-react";

const navLinks = [
  { to: "/holidays", label: "Holidays" },
  { to: "/menu", label: "Menu" },
  { to: "/layout", label: "Layout" },
  { to: "/amenities", label: "Amenities" },
];

const Navbar = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Building2 className="h-6 w-6" />
          HostelHub
        </Link>

        {isLoggedIn && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                {username}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Login / Signup</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
