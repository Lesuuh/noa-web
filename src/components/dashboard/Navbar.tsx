import { FaBell } from "react-icons/fa";
import { FiSearch, FiMenu } from "react-icons/fi";
import { Dispatch, SetStateAction } from "react";

interface NavbarProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      {/* Left side: Mobile menu button + Search bar */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
        >
          <FiMenu className="text-gray-700 w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border-none outline-none bg-transparent text-sm"
          />
        </div>
      </div>

      {/* Right side: Notification + Avatar */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <FaBell className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium hidden sm:inline">Lesuuh</span>
        </div>
      </div>
    </header>
  );
}
