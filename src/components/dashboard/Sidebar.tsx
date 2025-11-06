import { HelpCircle, Settings, Star, Target, X } from "@/lib/icons";
import { Dispatch, lazy, SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LogoutModal = lazy(() => import("../modals/LogoutModal"));

import { logoutUser } from "@/api/api";

const navItems = [
  { label: "Dashboard", icon: Target, href: "/" },
  // { label: "Take Exam", icon: Zap, href: "/exam" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Support", icon: HelpCircle, href: "/support" },
  { label: "Freemium", icon: Star, href: "/freemium" },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  const openLogoutModal = () => {
    setLogoutModal(true);
  };
  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      navigate("/login"); // Redirect to login after logout
    }
  };
  return (
    <>
      <aside
        className={`h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 
          fixed md:static inset-y-0 left-0 z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Rest of your sidebar code stays the same */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded flex items-center justify-center text-white font-bold text-sm drop-shadow-md">
              NOA
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900">NOA CBT</h1>
              <p className="text-[10px] text-slate-500">
                Professional Excellence
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100%-64px)] px-2 py-4">
          <nav className="space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={openLogoutModal}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-red-600 group-hover:text-red-700 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                />
              </svg>
              <span className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors">
                Logout
              </span>
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
