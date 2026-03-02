import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Eye,
  LogOut,
  Search,
  Bell,
  Settings,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: "Dashboard", path: "/admin/home", icon: LayoutDashboard },
  { name: "Questions", path: "/admin/questions", icon: ListChecks },
  { name: "Preview", path: "/admin/preview", icon: Eye },
  //   { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 shadow-sm">
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                NOA Admin
              </h1>
              <p className="text-xs text-gray-500">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Settings & Logout */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group">
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10 px-8 py-4 shadow-sm">
          <div className="flex justify-between items-center">
            {/* Page Title */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Welcome back, manage your content
              </p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <img
                  src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff&bold=true"
                  alt="Admin"
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
