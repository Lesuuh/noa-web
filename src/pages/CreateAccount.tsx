// "use client";

// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { createAccount, googleLogin } from "@/hooks/useAuth";
// import { useState } from "react";

// interface FormDetailsProps {
//   name: string;
//   email: string;
//   password: string;
// }

// const CreateAccount = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid, isDirty, isSubmitting },
//     setError,
//   } = useForm<FormDetailsProps>({ mode: "onChange" });

//   const onSubmit: SubmitHandler<FormDetailsProps> = async (data) => {
//     const user = await createAccount(data, setError, setLoading);
//     if (user) {
//       navigate("/dashboard");
//     }
//   };

//   const handleGoogleLogin = async () => {
//     const user = await googleLogin();
//     if (user) {
//       navigate("/dashboard");
//     } else {
//       navigate("/");
//     }
//   };

//   const pageStyle = {
//     backgroundImage: `url('/Computer Center After Dark.jpeg')`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     minHeight: "100vh",
//   };

//   return (
//     <section
//       style={pageStyle}
//       className="relative flex justify-center items-center w-full"
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/80" />

//       {/* Form Card */}
//       <div className="relative z-10 w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-semibold text-gray-100">Get Started</h2>
//           <p className="text-gray-400 text-sm">
//             Create an account with Google or your details
//           </p>
//         </div>

//         {/* Google Button */}
//         <Button
//           type="button"
//           onClick={handleGoogleLogin}
//           variant="outline"
//           className="w-full mb-6 flex items-center justify-center gap-2 bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600 hover:text-gray-50 transition-all duration-300"
//         >
//           <FcGoogle className="text-xl" />
//           Create Account with Google
//         </Button>

//         {/* Divider */}
//         <div className="relative my-6 text-center text-sm">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-600" />
//           </div>
//           <span className="relative z-10 bg-gray-800 px-2 text-gray-400">
//             Or continue with
//           </span>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium mb-1 text-gray-200"
//             >
//               Name
//             </label>
//             <input
//               type="text"
//               placeholder="John Doe"
//               {...register("name", {
//                 required: "Name is required",
//                 maxLength: {
//                   value: 20,
//                   message: "Name cannot exceed 20 characters",
//                 },
//                 minLength: {
//                   value: 3,
//                   message: "Name must be at least 3 characters",
//                 },
//               })}
//               required
//               className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//             />
//             {errors.name?.message && (
//               <p className="text-sm text-red-400 mt-1">
//                 {errors.name.message as string}
//               </p>
//             )}
//           </div>
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium mb-1 text-gray-200"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="johndoe@yourmail.com"
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: {
//                   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                   message: "Enter a valid email address",
//                 },
//               })}
//               required
//               className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//             />
//             {errors.email?.message && (
//               <p className="text-sm text-red-400 mt-1">
//                 {errors.email.message as string}
//               </p>
//             )}
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium mb-1 text-gray-200"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Create a unique password"
//               {...register("password", {
//                 required: "Password is required",
//                 pattern: {
//                   value:
//                     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
//                   message:
//                     "Password must be 6+ chars, with uppercase, lowercase, number, and symbol",
//                 },
//               })}
//               required
//               className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
//             />
//             {errors.password?.message && (
//               <p className="text-sm text-red-400 mt-1">
//                 {errors.password.message as string}
//               </p>
//             )}
//           </div>
//           <Button
//             type="submit"
//             disabled={isSubmitting || !isDirty || !isValid || loading}
//             className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Signing up..." : "Create Account"}
//           </Button>
//         </form>

//         {/* Login Link */}
//         <p className="text-sm text-center mt-4 text-gray-400">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/")}
//             className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors duration-200"
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </section>
//   );
// };

// export default CreateAccount;
