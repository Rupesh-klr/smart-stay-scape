import { useState } from "react";
import PageShell from "@/components/PageShell";
import CsvUpload from "@/components/CsvUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Room {
  id: string;
  floor: string;
  roomNumber: string;
  capacity: string;
  status: string;
}

const defaultRooms: Room[] = [
  { id: "1", floor: "Ground Floor", roomNumber: "G-01", capacity: "3", status: "Occupied" },
  { id: "2", floor: "Ground Floor", roomNumber: "G-02", capacity: "2", status: "Available" },
  { id: "3", floor: "First Floor", roomNumber: "1-01", capacity: "3", status: "Occupied" },
  { id: "4", floor: "First Floor", roomNumber: "1-02", capacity: "4", status: "Available" },
  { id: "5", floor: "Second Floor", roomNumber: "2-01", capacity: "2", status: "Maintenance" },
];

const statusColor = (s: string) => {
  switch (s.toLowerCase()) {
    case "available": return "bg-success/15 text-success border-success/20";
    case "occupied": return "bg-primary/10 text-primary border-primary/20";
    default: return "bg-warning/15 text-warning border-warning/20";
  }
};

const LayoutPage = () => {
  const [rooms, setRooms] = useState<Room[]>(defaultRooms);
  const [newFloor, setNewFloor] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newCap, setNewCap] = useState("");
  const [newStatus, setNewStatus] = useState("Available");

  const addRoom = () => {
    if (!newFloor || !newRoom) return;
    setRooms((prev) => [...prev, { id: crypto.randomUUID(), floor: newFloor, roomNumber: newRoom, capacity: newCap, status: newStatus }]);
    setNewFloor(""); setNewRoom(""); setNewCap(""); setNewStatus("Available");
  };

  const removeRoom = (id: string) => setRooms((prev) => prev.filter((r) => r.id !== id));

  const handleCsvUpload = (rows: string[][]) => {
    const [, ...data] = rows;
    const imported = data.map((row) => ({ id: crypto.randomUUID(), floor: row[0] || "", roomNumber: row[1] || "", capacity: row[2] || "", status: row[3] || "Available" }));
    setRooms((prev) => [...prev, ...imported]);
  };

  const grouped = rooms.reduce<Record<string, Room[]>>((acc, room) => {
    (acc[room.floor] = acc[room.floor] || []).push(room);
    return acc;
  }, {});

  return (
    <PageShell title="Room Layout" description="Floors and room allocation" icon={<LayoutGrid className="h-5 w-5" />}>
      {(editMode) => (
        <div className="space-y-6">
          {editMode && (
            <Card>
              <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Floor</label>
                  <Input value={newFloor} onChange={(e) => setNewFloor(e.target.value)} placeholder="e.g. Ground Floor" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Room No.</label>
                  <Input value={newRoom} onChange={(e) => setNewRoom(e.target.value)} placeholder="G-01" />
                </div>
                <div className="w-24 space-y-1">
                  <label className="text-sm font-medium">Capacity</label>
                  <Input value={newCap} onChange={(e) => setNewCap(e.target.value)} placeholder="3" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-sm font-medium">Status</label>
                  <Input value={newStatus} onChange={(e) => setNewStatus(e.target.value)} placeholder="Available" />
                </div>
                <Button onClick={addRoom} disabled={!newFloor || !newRoom}>
                  <Plus className="mr-1.5 h-4 w-4" /> Add
                </Button>
              </CardContent>
            </Card>
          )}

          {editMode && (
            <CsvUpload templateHeaders={["Floor", "RoomNumber", "Capacity", "Status"]} templateFilename="layout_template.csv" onUpload={handleCsvUpload} />
          )}

          <div className="space-y-4">
            {Object.entries(grouped).map(([floor, rooms]) => (
              <Card key={floor}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{floor}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                      <div key={room.id} className="group flex items-center justify-between rounded-lg border bg-card p-3">
                        <div>
                          <p className="font-medium">{room.roomNumber}</p>
                          <p className="text-xs text-muted-foreground">Capacity: {room.capacity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={statusColor(room.status)}>{room.status}</Badge>
                          {editMode && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100" onClick={() => removeRoom(room.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default LayoutPage;
