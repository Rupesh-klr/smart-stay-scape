import { useState } from "react";
import PageShell from "@/components/PageShell";
import CsvUpload from "@/components/CsvUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Plus, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  day: string;
  meal: string;
  items: string;
}

const defaultMenu: MenuItem[] = [
  { id: "1", day: "Monday", meal: "Breakfast", items: "Poha, Tea, Banana" },
  { id: "2", day: "Monday", meal: "Lunch", items: "Dal, Rice, Roti, Salad" },
  { id: "3", day: "Monday", meal: "Dinner", items: "Paneer, Rice, Roti, Sweet" },
  { id: "4", day: "Tuesday", meal: "Breakfast", items: "Idli, Sambhar, Coffee" },
  { id: "5", day: "Tuesday", meal: "Lunch", items: "Rajma, Rice, Roti, Raita" },
];

const Menu = () => {
  const [menu, setMenu] = useState<MenuItem[]>(defaultMenu);
  const [newDay, setNewDay] = useState("");
  const [newMeal, setNewMeal] = useState("");
  const [newItems, setNewItems] = useState("");

  const addItem = () => {
    if (!newDay || !newMeal || !newItems) return;
    setMenu((prev) => [...prev, { id: crypto.randomUUID(), day: newDay, meal: newMeal, items: newItems }]);
    setNewDay("");
    setNewMeal("");
    setNewItems("");
  };

  const removeItem = (id: string) => setMenu((prev) => prev.filter((m) => m.id !== id));

  const handleCsvUpload = (rows: string[][]) => {
    const [, ...data] = rows;
    const imported = data.map((row) => ({ id: crypto.randomUUID(), day: row[0] || "", meal: row[1] || "", items: row[2] || "" }));
    setMenu((prev) => [...prev, ...imported]);
  };

  const grouped = menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.day] = acc[item.day] || []).push(item);
    return acc;
  }, {});

  return (
    <PageShell title="Mess Menu" description="Weekly meal schedule" icon={<UtensilsCrossed className="h-5 w-5" />}>
      {(editMode) => (
        <div className="space-y-6">
          {editMode && (
            <Card>
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Day</label>
                  <Input value={newDay} onChange={(e) => setNewDay(e.target.value)} placeholder="e.g. Monday" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Meal</label>
                  <Input value={newMeal} onChange={(e) => setNewMeal(e.target.value)} placeholder="Breakfast / Lunch / Dinner" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Items</label>
                  <Input value={newItems} onChange={(e) => setNewItems(e.target.value)} placeholder="Dal, Rice, Roti" />
                </div>
                <Button onClick={addItem} disabled={!newDay || !newMeal || !newItems}>
                  <Plus className="mr-1.5 h-4 w-4" /> Add
                </Button>
              </CardContent>
            </Card>
          )}

          {editMode && (
            <CsvUpload templateHeaders={["Day", "Meal", "Items"]} templateFilename="menu_template.csv" onUpload={handleCsvUpload} />
          )}

          <div className="space-y-4">
            {Object.entries(grouped).map(([day, items]) => (
              <Card key={day}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{day}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                      <div>
                        <span className="mr-2 text-xs font-semibold uppercase text-primary">{item.meal}</span>
                        <span className="text-sm">{item.items}</span>
                      </div>
                      {editMode && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Menu;
