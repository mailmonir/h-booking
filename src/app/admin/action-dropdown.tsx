"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import AlertDialogs from "@/components/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActionDropdownProps {
  deleteItem: (id: string) => void;
  id: string;
  url: string;
}

const ActionDropdown = ({ deleteItem, url, id }: ActionDropdownProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    deleteItem(id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical
            size={18}
            className="text-muted-foreground cursor-pointer hover:text-accent-foreground"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(url)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogs
        open={open}
        setOpen={setOpen}
        handleDeleteClick={handleDeleteClick}
        id={id}
      />
    </>
  );
};

export default ActionDropdown;
