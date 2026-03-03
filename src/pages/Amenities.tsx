import { useState } from "react";
import PageShell from "@/components/PageShell";
import CsvUpload from "@/components/CsvUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShowerHead, Plus, Trash2, Droplets, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Amenity {
  id: string;
  category: string;
  name: string;
  location: string;
  status: string;
}

const defaultAmenities: Amenity[] = [
  { id: "1", category: "Washroom", name: "Washroom A", location: "Ground Floor", status: "Functional" },
  { id: "2", category: "Washroom", name: "Washroom B", location: "First Floor", status: "Under Maintenance" },
  { id: "3", category: "Drinking Water", name: "RO Unit 1", location: "Ground Floor Lobby", status: "Functional" },
  { id: "4", category: "Drinking Water", name: "RO Unit 2", location: "Second Floor", status: "Functional" },
  { id: "5", category: "Mess", name: "Main Mess Hall", location: "Ground Floor", status: "Functional" },
];

const categoryIcon = (cat: string) => {
  switch (cat.toLowerCase()) {
    case "washroom": return <ShowerHead className="h-4 w-4" />;
    case "drinking water": return <Droplets className="h-4 w-4" />;
    case "mess": return <UtensilsCrossed className="h-4 w-4" />;
    default: return <ShowerHead className="h-4 w-4" />;
  }
};

const Amenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>(defaultAmenities);
  const [newCat, setNewCat] = useState("");
  const [newName, setNewName] = useState("");
  const [newLoc, setNewLoc] = useState("");
  const [newStatus, setNewStatus] = useState("Functional");

  const addAmenity = () => {
    if (!newCat || !newName) return;
    setAmenities((prev) => [...prev, { id: crypto.randomUUID(), category: newCat, name: newName, location: newLoc, status: newStatus }]);
    setNewCat(""); setNewName(""); setNewLoc(""); setNewStatus("Functional");
  };

  const removeAmenity = (id: string) => setAmenities((prev) => prev.filter((a) => a.id !== id));

  const handleCsvUpload = (rows: string[][]) => {
    const [, ...data] = rows;
    const imported = data.map((row) => ({ id: crypto.randomUUID(), category: row[0] || "", name: row[1] || "", location: row[2] || "", status: row[3] || "Functional" }));
    setAmenities((prev) => [...prev, ...imported]);
  };

  const grouped = amenities.reduce<Record<string, Amenity[]>>((acc, a) => {
    (acc[a.category] = acc[a.category] || []).push(a);
    return acc;
  }, {});

  return (
    <PageShell title="Amenities" description="Washrooms, drinking water, mess facilities" icon={<ShowerHead className="h-5 w-5" />}>
      {(editMode) => (
        <div className="space-y-6">
          {editMode && (
            <Card>
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Category</label>
                  <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Washroom / Drinking Water / Mess" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Washroom A" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Location</label>
                  <Input value={newLoc} onChange={(e) => setNewLoc(e.target.value)} placeholder="Ground Floor" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Status</label>
                  <Input value={newStatus} onChange={(e) => setNewStatus(e.target.value)} placeholder="Functional" />
                </div>
                <Button onClick={addAmenity} disabled={!newCat || !newName}>
                  <Plus className="mr-1.5 h-4 w-4" /> Add
                </Button>
              </CardContent>
            </Card>
          )}

          {editMode && (
            <CsvUpload templateHeaders={["Category", "Name", "Location", "Status"]} templateFilename="amenities_template.csv" onUpload={handleCsvUpload} />
          )}

          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="mb-3 flex items-center gap-2 text-primary">
                  {categoryIcon(category)}
                  <h2 className="font-display text-lg font-semibold">{category}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((a) => (
                    <Card key={a.id} className="group transition-shadow hover:shadow-md">
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{a.name}</p>
                          <p className="text-sm text-muted-foreground">{a.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={a.status === "Functional" ? "default" : "secondary"}>
                            {a.status}
                          </Badge>
                          {editMode && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeAmenity(a.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Amenities;
