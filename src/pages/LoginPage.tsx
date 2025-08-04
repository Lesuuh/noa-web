import { Button } from "@/components/ui/button";
import { login } from "@/hooks/useAuth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

interface LoginDetailsProps {
  email: string;
  password: string;
}
const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    setError,
  } = useForm<LoginDetailsProps>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<LoginDetailsProps> = async (data) => {
    const user = await login(data, setError, setLoading);
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const pageStyle = {
    backgroundImage: `url('/Computer Center After Dark.jpeg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  return (
    <section
      style={pageStyle}
      className="relative flex justify-center items-center w-full"
    >
      <div className="absolute inset-0 bg-black/90" />
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-md shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-gray-600 text-sm">
            Log in with your Google account
          </p>
        </div>

        {/* Google Login Button */}
        <Button
          variant="outline"
          className="w-full mb-6 flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-xl" />
          Login with Google
        </Button>

        {/* Divider */}
        <div className="relative my-6 text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <span className="relative z-10 bg-white px-2 text-gray-500">
            Or continue with
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Enter your email" })}
              placeholder="johndoe@yourmail.com"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {errors.email?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <p className="text-sm mb-1">Forget your password?</p>
            </div>
            <input
              type="password"
              {...register("password", { required: "Enter your password" })}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {errors.password?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message as string}
              </p>
            )}
          </div>
          <div>
            {errors.root?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.root.message as string}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty || loading}
            className="w-full px-6 py-3 rounded-md shadow-md transition-all duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Redirect */}
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/create-account")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
