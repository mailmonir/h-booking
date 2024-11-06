"use client";

import {
  Home,
  Users,
  Settings,
  NotebookTabsIcon,
  Building2,
  BadgeDollarSign,
  Blocks,
  Bed,
  ListChecks,
  School,
  ImagePlay,
  GalleryVertical,
  CalendarRange,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const navItems = [
  {
    id: 1,
    name: "Dashboard",
    href: "/admin",
    icon: <Home className="text-muted-foreground" />,
  },
  {
    id: 2,
    name: "Bookings",
    href: "/admin/bookings",
    icon: <CalendarRange className="text-muted-foreground" />,
  },
  {
    id: 3,
    name: "Rooms",
    href: "/admin/rooms",
    icon: <Building2 className="text-muted-foreground" />,
  },
  {
    id: 4,
    name: "Room Classes",
    href: "/admin/room-class",
    icon: <School className="text-muted-foreground" />,
  },
  {
    id: 5,
    name: "Room Features",
    href: "/admin/features",
    icon: <ListChecks className="text-muted-foreground" />,
  },
  {
    id: 6,
    name: "Bed Types",
    href: "/admin/bed-types",
    icon: <Bed className="text-muted-foreground" />,
  },
  {
    id: 7,
    name: "Room Status",
    href: "/admin/room-status",
    icon: <NotebookTabsIcon className="text-muted-foreground" />,
  },
  {
    id: 8,
    name: "Addons",
    href: "/admin/addons",
    icon: <Blocks className="text-muted-foreground" />,
  },
  {
    id: 9,
    name: "Payment Status",
    href: "/admin/payment-status",
    icon: <BadgeDollarSign className="text-muted-foreground" />,
  },
  {
    id: 10,
    name: "Floor",
    href: "/admin/floors",
    icon: <GalleryVertical className="text-muted-foreground" />,
  },
  {
    id: 11,
    name: "Users",
    href: "/admin/users",
    icon: <Users className="text-muted-foreground" />,
  },
  {
    id: 12,
    name: "Media",
    href: "/admin/media",
    icon: <ImagePlay className="text-muted-foreground" />,
  },
  {
    id: 13,
    name: "Settings",
    href: "/admin/settings",
    icon: <Settings className="text-muted-foreground" />,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-col flex-1 gap-y-4">
        {navItems.map((item, index) => (
          <li
            key={item.id}
            className={cn(navItems.length === index + 1 && "mt-auto")}
          >
            <Link
              href={item.href}
              className={cn(
                pathname.includes(item.href) && item.href !== "/admin"
                  ? item.href === "/admin"
                    ? "text-primary bg-muted"
                    : "text-primary bg-muted"
                  : "text-foreground",
                " leading-6 font-semibold text-sm p-2 rounded-md gap-x-3 flex hover:text-primary hover:bg-muted"
              )}
            >
              {item.icon}
              <span>
                {item.name} {pathname !== "/admin"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
