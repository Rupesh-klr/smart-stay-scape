import { useState } from "react";
import PageShell from "@/components/PageShell";
import CsvUpload from "@/components/CsvUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus, Trash2 } from "lucide-react";

interface Holiday {
  id: string;
  date: string;
  name: string;
}

const defaultHolidays: Holiday[] = [
  { id: "1", date: "2026-01-26", name: "Republic Day" },
  { id: "2", date: "2026-03-17", name: "Holi" },
  { id: "3", date: "2026-08-15", name: "Independence Day" },
  { id: "4", date: "2026-10-20", name: "Diwali" },
];

const Holidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(defaultHolidays);
  const [newDate, setNewDate] = useState("");
  const [newName, setNewName] = useState("");

  const addHoliday = () => {
    if (!newDate || !newName) return;
    setHolidays((prev) => [...prev, { id: crypto.randomUUID(), date: newDate, name: newName }]);
    setNewDate("");
    setNewName("");
  };

  const removeHoliday = (id: string) => setHolidays((prev) => prev.filter((h) => h.id !== id));

  const handleCsvUpload = (rows: string[][]) => {
    const [, ...data] = rows;
    const imported = data.map((row) => ({ id: crypto.randomUUID(), date: row[0] || "", name: row[1] || "" }));
    setHolidays((prev) => [...prev, ...imported]);
  };

  return (
    <PageShell title="Holidays" description="View and manage hostel holidays" icon={<CalendarDays className="h-5 w-5" />}>
      {(editMode) => (
        <div className="space-y-6">
          {editMode && (
            <Card>
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Holiday Name</label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Republic Day" />
                </div>
                <Button onClick={addHoliday} disabled={!newDate || !newName}>
                  <Plus className="mr-1.5 h-4 w-4" /> Add
                </Button>
              </CardContent>
            </Card>
          )}

          {editMode && (
            <CsvUpload templateHeaders={["Date", "Name"]} templateFilename="holidays_template.csv" onUpload={handleCsvUpload} />
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {holidays.map((h) => (
              <Card key={h.id} className="group transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{h.name}</p>
                    <p className="text-sm text-muted-foreground">{h.date}</p>
                  </div>
                  {editMode && (
                    <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeHoliday(h.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Holidays;
