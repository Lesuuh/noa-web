// import { useUser } from "@/contexts/UserContext";
// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { updateUserProfile } from "@/api/api";

// const Switch = ({ checked, onCheckedChange, disabled }) => (
//   <button
//     role="switch"
//     aria-checked={checked}
//     disabled={disabled}
//     onClick={() => onCheckedChange?.(!checked)}
//     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
//       checked ? "bg-emerald-600" : "bg-gray-200"
//     } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//   >
//     <span
//       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//         checked ? "translate-x-6" : "translate-x-1"
//       }`}
//     />
//   </button>
// );

// const Settings = () => {
//   const { user } = useUser();
//   const [formData, setFormData] = useState({
//     name: user?.full_name || "",
//     email: user?.email || "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const mutation = useMutation<
//     { success: boolean; updated: typeof formData }, // returned data
//     Error, // error type
//     void // variables type (none in this case)
//   >({
//     mutationFn: async () => {
//       if (!user) throw new Error("User not loaded");
//       return updateUserProfile(formData, user);
//     },
//     onSuccess: () => {
//       alert("Profile updated!");
//     },
//     onError: (err) => {
//       alert(err.message || "Failed to update profile");
//     },
//   });

//   return (
//     <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//           Settings
//         </h1>
//         <p className="text-sm text-gray-500">
//           Customize your account, preferences, and notifications.
//         </p>
//       </div>

//       {/* Settings Sections */}
//       <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//         {/* Account Info */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold text-gray-900">Account</h2>

//           {/* Name */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
//             <label className="w-32 text-gray-700 font-medium">Name</label>
//             <input
//               type="text"
//               value={formData.name}
//               placeholder="John F. Doe"
//               name="name"
//               onChange={handleChange}
//               className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>

//           {/* Email */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
//             <label className="w-32 text-gray-700 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               placeholder="johndoe@yourmail.com"
//               onChange={handleChange}
//               className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             />
//           </div>

//           {/* Plan */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
//             <label className="w-32 text-gray-700 font-medium">Plan</label>
//             <div className="flex items-center gap-2">
//               <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
//                 Free Plan
//               </span>
//               <button className="text-emerald-600 text-sm font-semibold hover:underline">
//                 Upgrade
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Preferences */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>

//           {/* Dark Mode (Coming Soon) */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 opacity-50 pointer-events-none">
//             <label className="w-32 text-gray-700 font-medium flex items-center gap-2">
//               Dark Mode
//               <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
//                 Coming soon
//               </span>
//             </label>
//             <div className="flex items-center space-x-2">
//               <Switch />
//             </div>
//           </div>

//           {/* Email Notifications (Coming Soon) */}
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 opacity-50 pointer-events-none">
//             <label className="w-32 text-gray-700 font-medium flex items-center gap-2">
//               Email Notifications
//               <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
//                 Coming soon
//               </span>
//             </label>
//             <div className="flex items-center space-x-2">
//               <Switch />
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-end">
//           <button
//             onClick={() => mutation.mutate()}
//             disabled={mutation.isLoading}
//             className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors"
//           >
//             {mutation.isLoading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>

//       {/* Danger Zone */}
//       <div className="space-y-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//         <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
//         <p className="text-sm text-gray-500">
//           Permanently delete your account. This action cannot be undone.
//         </p>
//         <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors">
//           Delete Account
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Settings;
