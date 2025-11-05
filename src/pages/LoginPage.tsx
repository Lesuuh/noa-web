"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginWithEmail, loginWithGoogle } from "@/api/api";

interface LoginDetailsProps {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<LoginDetailsProps>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginDetailsProps> = async (data) => {
    setLoading(true);
    try {
      await loginWithEmail(data);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // navigate("/");
    } catch (error) {
      if (error instanceof Error) setServerError(error.message);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Left brand column */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-center items-center text-center w-1/2 p-10"
      >
        <h1 className="text-4xl font-extrabold text-emerald-700 mb-4">
          NOA Practice Portal
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-md">
          Prepare smarter, track progress, and dominate your CBT exams — all in
          one clean dashboard.
        </p>
        <img
          src="/login.svg"
          alt="Login illustration"
          className="mt-10 w-3/4"
        />
      </motion.div>

      {/* Right login form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Welcome Back 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Log in to continue your exam journey
          </p>
        </div>

        {/* Google login */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative my-6 text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative z-10 bg-white px-2 text-slate-500">
            or log in with email
          </span>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <p className="text-sm text-red-500 bg-red-100/60 p-2 rounded-md border border-red-200">
              {serverError}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-slate-700"
            >
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: "Enter your email" })}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {errors.email?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              {...register("password", { required: "Enter your password" })}
              placeholder="••••••••"
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
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-slate-500">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/create-account")}
            className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-700"
          >
            Create one
          </span>
        </p>
      </motion.div>
    </section>
  );
};

export default LoginPage;
