// "use client";
// import {
//   BarChart3,
//   BookOpen,
//   Home,
//   LogOut,
//   Settings,
//   Trophy,
//   User2Icon,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useState } from "react";

// interface SidebarProps {
//   userDetails?: { name: string } | null;
//   userPhotoURL?: string;
//   onLogout?: () => void;
// }

// export function Sidebar({ userDetails, userPhotoURL, onLogout }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const navItems = [
//     { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
//     { icon: BookOpen, label: "Tests", href: "/exam" },
//     { icon: BarChart3, label: "Analytics", href: "/analytics" },
//     { icon: Trophy, label: "Achievements", href: "/achievements" },
//   ];

//   return (
//     <aside
//       className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-700/50 transition-all duration-300 z-50 ${
//         isCollapsed ? "w-20" : "w-64"
//       }`}
//     >
//       {/* Logo/Brand */}
//       <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
//         {!isCollapsed && (
//           <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
//             TestMaster
//           </h2>
//         )}
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
//         >
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//       </div>

//       {/* User Profile Section */}
//       <div className="p-4 border-b border-slate-700/50">
//         <div className="flex items-center gap-3">
//           {userPhotoURL ? (
//             <img
//               src={userPhotoURL || "/placeholder.svg"}
//               alt="User profile"
//               className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/50"
//             />
//           ) : (
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
//               <User2Icon className="text-white w-5 h-5" />
//             </div>
//           )}
//           {!isCollapsed && (
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold text-slate-200 truncate">
//                 {userDetails?.name || "User"}
//               </p>
//               <p className="text-xs text-slate-500">Active</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Navigation Items */}
//       <nav className="flex-1 px-3 py-6 space-y-2">
//         {navItems.map((item) => (
//           <Link key={item.href} to={item.href} className="block">
//             <button
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
//                 item.active
//                   ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
//                   : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
//               }`}
//             >
//               <item.icon className="w-5 h-5 flex-shrink-0" />
//               {!isCollapsed && (
//                 <span className="text-sm font-medium">{item.label}</span>
//               )}
//             </button>
//           </Link>
//         ))}
//       </nav>

//       {/* Bottom Actions */}
//       <div className="p-3 border-t border-slate-700/50 space-y-2">
//         <Link to="/settings" className="block">
//           <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
//             <Settings className="w-5 h-5 flex-shrink-0" />
//             {!isCollapsed && (
//               <span className="text-sm font-medium">Settings</span>
//             )}
//           </button>
//         </Link>
//         <button
//           onClick={onLogout}
//           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
//         >
//           <LogOut className="w-5 h-5 flex-shrink-0" />
//           {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }
