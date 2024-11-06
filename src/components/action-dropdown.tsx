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
import { deleteCategory } from "@/app/admin/features/actions";
import AlertDialogs from "@/components/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActionDropdownProps {
  catId: string;
}

const ActionDropdown = ({ catId }: ActionDropdownProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    deleteCategory(catId);
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
          <DropdownMenuItem
            onClick={() => router.push(`/admin/categories/edit/${slug}`)}
          >
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
      />
    </>
  );
};

export default ActionDropdown;
