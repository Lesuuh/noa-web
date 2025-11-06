import { Dispatch, SetStateAction } from "react";
import { Menu } from "@/lib/icons";
import { useUser } from "@/contexts/UserContext";

interface NavbarProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const { user } = useUser();
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      {/* Left side: Mobile menu button + Search bar */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
        >
          <Menu className="text-gray-700 w-5 h-5" />
        </button>

        <div className="w-10 h-8 md:hidden bg-gradient-to-br from-emerald-600 to-emerald-800 rounded flex items-center justify-center text-white font-bold text-sm drop-shadow-md">
          NOA
        </div>
      </div>

      {/* Right side: Notification + Avatar */}
      <div className="flex items-center gap-6">
        {/* <button className="relative">
          <Bell className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button> */}
        <div className="flex items-center gap-2">
          <div
            className="rounded-full w-8 h-8 bg-emerald-600 text-white flex items-center justify-center text-xl"
            aria-label={`User initial ${user?.full_name?.charAt(0) ?? ""}`}
          >
            {user?.full_name?.charAt(0) ?? "?"}
          </div>

          <span className="text-sm font-medium hidden sm:inline">
            {user?.full_name}
          </span>
        </div>
      </div>
    </header>
  );
}
