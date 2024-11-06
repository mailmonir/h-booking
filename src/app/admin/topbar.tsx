import { Bell } from "lucide-react";
// import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/profile-dropdown";
import MobileNav from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mdoe-toggle";
import FullScreenButton from "@/components/full-screen-button";
import AdminSidebar from "./sidenav";

const Topbar = () => {
  return (
    <div className="sticky top-0 z-40 flex shrink-0 h-16 items-center gap-x-4 border-b border-border bg-background px-4 ring-0 sm:px-6 lg:px-8">
      <MobileNav menu={<AdminSidebar />} />
      {/* <div
        className="bg-gray-200 dark:bg-gray-500 w-px h-6"
        aria-hidden="true"
      /> */}
      <div className="self-stretch flex flex-1 gap-x-4 lg:gap-x-6">
        {/* <Search /> */}
        <div className="flex items-center gap-x-6 ml-auto">
          <FullScreenButton />
          <Button variant={"ghost"} className="rounded-full p-0 w-10 h-10">
            <span className="sr-only">View notifications</span>
            <Bell size={20} />
          </Button>
          <ModeToggle />
          <div
            className="bg-gray-200 dark:bg-gray-500 w-px h-6"
            aria-hidden="true"
          />
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
