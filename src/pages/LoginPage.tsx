import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LazyMotion, domAnimation, AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import { loginWithEmail } from "@/api/api";
import { useUser } from "@/contexts/UserContext";

interface LoginDetailsProps {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string>("");
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginDetailsProps>({
    mode: "onChange",
  });

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const onSubmit: SubmitHandler<LoginDetailsProps> = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      await loginWithEmail(data);
    } catch (error) {
      if (error instanceof Error) setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-emerald-100/50 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl" />

      <LazyMotion features={domAnimation}>
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Column: Professional Brand Content */}
          <m.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center items-start"
          >
            <m.span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-6">
              Official Portal
            </m.span>

            <h1 className="text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              Advance Your <br />
              <span className="text-emerald-700">Civil Service Career.</span>
            </h1>

            <p className="text-slate-600 text-xl leading-relaxed max-w-lg">
              Access your personalized dashboard to master the Public Service
              Rules, Financial Instructions, and Current Affairs required for
              your next grade level.
            </p>

            <div className="mt-12 space-y-6">
              {[
                { id: "01", text: "CBT Promotion Exam Simulations" },
                { id: "02", text: "Board Interview Preparation" },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 text-slate-700 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {item.id}
                  </div>
                  <span className="font-semibold text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </m.div>

          {/* Right Column: Login Card */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-white p-8 md:p-12">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900">
                  Officer Login
                </h2>
                <p className="text-slate-500 mt-2">
                  Enter your credentials to access the portal
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {serverError && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm font-medium text-red-600 bg-red-50 p-4 rounded-xl border border-red-100"
                    >
                      {serverError}
                    </m.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="officer@agency.gov"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 ring-offset-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none shadow-sm"
                  />
                  {errors.email && (
                    <span className="text-xs font-medium text-red-500 ml-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 ring-offset-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none shadow-sm"
                  />
                  {errors.password && (
                    <span className="text-xs font-medium text-red-500 ml-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || !isDirty || loading}
                  className="w-full py-7 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Access Portal"
                  )}
                </Button>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/create-account")}
                    className="text-emerald-600 font-bold hover:underline underline-offset-4"
                  >
                    Register here
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

export default LoginPage;
