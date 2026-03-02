"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "motion/react";
import { supabase } from "@/supabase";

interface FormDetailsProps {
  name: string;
  email: string;
  password: string;
}

const CreateAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormDetailsProps>({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormDetailsProps> = async (formData) => {
    setLoading(true);
    setServerError("");

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setServerError("User ID not found. Please try again.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        email: formData.email,
        full_name: formData.name,
        role: "user",
      },
    ]);

    if (insertError) {
      setServerError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/");
  };

  return (
    <section className="relative min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-emerald-100/50 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-100/40 rounded-full blur-3xl" />

      <LazyMotion features={domAnimation}>
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Info Side */}
          {/* Info Side - Redesigned for Government Context */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block space-y-8"
          >
            <div>
              <m.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-4"
              >
                Professional Advancement
              </m.span>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Secure your <span className="text-emerald-600">Promotion</span>{" "}
                with confidence.
              </h1>
              <p className="mt-6 text-slate-600 text-lg max-w-md leading-relaxed">
                Join thousands of officers using the NOA Portal to master
                promotional CBTs and interview simulations designed for the
                civil service.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { text: "Civil Service Rule Simulations", icon: "⚖️" },
                { text: "Mock Promotional Interviews", icon: "👔" },
                { text: "Previous CBT Past Questions", icon: "📑" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-slate-700 font-medium bg-white/40 p-3 rounded-xl border border-white/60 shadow-sm w-fit"
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </m.div>

          {/* Signup Card */}
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/5 border border-white p-8 md:p-10">
              <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900">
                  Create Account
                </h2>
                <p className="text-slate-500 mt-2">
                  Sign up to get started today
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AnimatePresence mode="wait">
                  {serverError && (
                    <m.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100"
                    >
                      {serverError}
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 3, message: "Name is too short" },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 ml-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email",
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 ml-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                        message: "Must include uppercase, number & symbol",
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                  {errors.password && (
                    <span className="text-xs text-red-500 ml-1 leading-tight block">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || !isDirty || loading}
                  className="w-full py-6 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-emerald-600 font-bold hover:underline underline-offset-4"
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          </m.div>
        </div>
      </LazyMotion>
    </section>
  );
};

export default CreateAccount;
