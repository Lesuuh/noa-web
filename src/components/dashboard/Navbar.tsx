import { Dispatch, SetStateAction } from "react";
import { Menu, Bell, ChevronRight } from "@/lib/icons";
import { useUser } from "@/contexts/UserContext";
import { Search } from "lucide-react";

interface NavbarProps {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const { user } = useUser();

  // const pathname = typeof window !== "undefined" ? window.location.pathname : ""

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Left side: Navigation Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 rounded-xl hover:bg-slate-100 transition-all active:scale-95 md:hidden border border-slate-200 shadow-sm"
        >
          <Menu className="text-slate-700 w-5 h-5" />
        </button>

        {/* Desktop Breadcrumb/Status Indicator */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Portal</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-slate-900 font-black tracking-tight">Dashboard</span>
        </div>

        {/* Mobile Logo Branding */}
        <div className="md:hidden flex items-center gap-2">
           <div className="w-9 h-7 bg-emerald-700 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-900/20">
            NOA
          </div>
        </div>
      </div>

      {/* Right side: Global Actions & User Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Global Search Placeholder (Official Look) */}
        <button className="p-2.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all hidden sm:block">
          <Search className="w-5 h-5" />
        </button>

        {/* Notification Hub */}
        <button className="relative p-2.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 bg-red-600 border-2 border-white w-2.5 h-2.5 rounded-full" />
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-slate-200 hidden xs:block" />

        {/* User Identity Section */}
        <div className="flex items-center gap-3 pl-1">
          <div className="flex flex-col items-end hidden lg:flex">
            <span className="text-sm font-black text-slate-900 leading-none">
              {user?.full_name || "Guest Officer"}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">
              Active Session
            </span>
          </div>

          <div 
            className="w-10 h-10 rounded-2xl bg-emerald-700 border-2 border-emerald-100 shadow-lg shadow-emerald-900/10 flex items-center justify-center text-white font-black text-lg transition-transform hover:rotate-3 cursor-pointer"
            aria-label={`Officer ${user?.full_name?.charAt(0) ?? "O"}`}
          >
            {user?.full_name?.charAt(0) ?? "O"}
          </div>
        </div>
      </div>
    </header>
  );
}