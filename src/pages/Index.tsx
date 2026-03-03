import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CalendarDays, UtensilsCrossed, LayoutGrid, ShowerHead } from "lucide-react";

const features = [
  { to: "/holidays", icon: CalendarDays, title: "Holidays", desc: "View hostel holiday calendar" },
  { to: "/menu", icon: UtensilsCrossed, title: "Mess Menu", desc: "Weekly meal schedule" },
  { to: "/layout", icon: LayoutGrid, title: "Room Layout", desc: "Floor and room details" },
  { to: "/amenities", icon: ShowerHead, title: "Amenities", desc: "Washrooms, water, mess info" },
];

const Index = () => {
  const { isLoggedIn, username, role } = useAuth();

  return (
    <div className="container max-w-4xl py-16 animate-fade-in">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Building2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight">HostelHub</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {isLoggedIn
            ? `Welcome back, ${username}! ${role === "admin" ? "(Admin)" : ""}`
            : "Your hostel management dashboard"}
        </p>
        {!isLoggedIn && (
          <Link to="/login">
            <Button size="lg" className="mt-6">Get Started</Button>
          </Link>
        )}
      </div>

      {isLoggedIn && (
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Link key={f.to} to={f.to}>
              <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold">{f.title}</h2>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
