import Topbar from "./topbar";
import AdminSidebar from "./sidenav";
import Logo from "@/components/logo";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { session } = await getCurrentSession();
  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <div className="hidden lg:w-72 lg:fixed lg:flex lg:flex-col lg:inset-y-0 z-50">
        <div className="flex flex-col grow px-6 pb-4 overflow-y-auto gap-y-5 bg-background border-r border-border">
          <div className="flex shrink-0 items-center h-16">
            <Logo />
          </div>
          <AdminSidebar />
        </div>
      </div>
      <div className="lg:pl-72">
        <Topbar />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
