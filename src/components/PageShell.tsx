import { useState } from "react";
import EditModeToggle from "@/components/EditModeToggle";

interface PageShellProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: (editMode: boolean) => React.ReactNode;
}

const PageShell = ({ title, description, icon, children }: PageShellProps) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="container max-w-5xl py-8 animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <EditModeToggle editMode={editMode} onToggle={setEditMode} />
      </div>
      {children(editMode)}
    </div>
  );
};

export default PageShell;
