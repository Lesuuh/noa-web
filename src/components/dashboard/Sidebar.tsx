import {
  List,
  Settings,
  Star,
  Target,
  X,
  
} from "@/lib/icons";
import { Dispatch, lazy, SetStateAction, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LogoutModal = lazy(() => import("../modals/LogoutModal"));
import { logoutUser } from "@/api/api";
import { LogOut, ShieldCheck } from "lucide-react";

const navItems = [
  { label: "Executive Dashboard", icon: Target, href: "/" },
  { label: "Examination History", icon: List, href: "/history" },
  { label: "System Settings", icon: Settings, href: "/settings" },
  { label: "Premium Access", icon: Star, href: "/freemium" },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Used to highlight active routes

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) navigate("/login");
  };

  return (
    <>
      <aside
        className={`h-full w-72 bg-white border-r border-slate-200 transition-all duration-300 
          fixed md:static inset-y-0 left-0 z-50 shadow-xl md:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header / Brand Identity */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-slate-900 text-sm tracking-tight leading-none mb-1">
                NOA PORTAL
              </h1>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest leading-none">
                CBT Division
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors md:hidden"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col justify-between h-[calc(100%-80px)] p-4">
          <div className="space-y-6">
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Main Menu
              </p>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "text-slate-600 hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? "text-emerald-700"
                            : "text-slate-400 group-hover:text-emerald-600"
                        }`}
                      />
                      <span
                        className={`text-sm tracking-tight ${isActive ? "font-bold" : "font-semibold"}`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-2xl relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <p className="text-white text-xs font-bold mb-1">
                  Service Status
                </p>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  System Verified
                </p>
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <ShieldCheck className="text-white w-10 h-10 -rotate-12" />
              </div>
            </div>

            <button
              onClick={() => setLogoutModal(true)}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-700 transition-all font-bold text-sm border border-transparent hover:border-red-100 group"
            >
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <LogoutModal
        handleLogout={handleLogout}
        setLogoutModal={setLogoutModal}
        logoutModal={logoutModal}
      />
    </>
  );
};

export default Sidebar;
