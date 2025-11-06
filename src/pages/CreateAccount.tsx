"use client";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/supabase";
import GoogleIcon from "@/lib/GoogleIcon";


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
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<FormDetailsProps>({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormDetailsProps> = async (formData) => {
    setLoading(true);
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

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setServerError(error.message);
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Left illustration / info */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-center items-center text-center w-1/2 p-10"
      >
        <h1 className="text-4xl font-extrabold text-emerald-700 mb-4">
          Join the NOA Practice Portal
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-md">
          Track your progress, take timed tests, and master your exam
          preparation with confidence.
        </p>
        <img
          src="/login.svg"
          alt="Signup illustration"
          className="mt-10 w-3/4"
          loading="lazy"
        />
      </motion.div>

      {/* Signup form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Create Your Account
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Sign up with Google or your email address
          </p>
        </div>

        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all"
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative my-6 text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative z-10 bg-white px-2 text-slate-500">
            or create with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <p className="text-sm text-red-500 bg-red-100/60 p-2 rounded-md border border-red-200">
              {serverError}
            </p>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters",
                },
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {errors.name?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {errors.email?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "At least 6 chars with uppercase, lowercase, number & symbol",
                },
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {errors.password?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty || loading}
            className="w-full px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-slate-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-700"
          >
            Login
          </span>
        </p>
      </motion.div>
    </section>
  );
};

export default CreateAccount;
