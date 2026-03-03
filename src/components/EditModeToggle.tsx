import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

interface EditModeToggleProps {
  editMode: boolean;
  onToggle: (value: boolean) => void;
}

const EditModeToggle = ({ editMode, onToggle }: EditModeToggleProps) => {
  const { role } = useAuth();

  if (role !== "admin") return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 shadow-sm">
      <Pencil className="h-4 w-4 text-muted-foreground" />
      <Label htmlFor="edit-mode" className="cursor-pointer text-sm font-medium">
        Edit Mode
      </Label>
      <Switch id="edit-mode" checked={editMode} onCheckedChange={onToggle} />
    </div>
  );
};

export default EditModeToggle;
