import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormDetailsProps {
  name: string;
  email: string;
  password: string;
}

const CreateAccount = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<FormDetailsProps>({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormDetailsProps> = (data) => {
    console.log(data);
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-md shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <p className="text-gray-600 text-sm">
            Create an account with Google or your details
          </p>
        </div>

        {/* Google Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full mb-6 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100 transition-all duration-300"
        >
          <FcGoogle className="text-xl" />
          Create Account with Google
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name", {
                required: "Name is required",
                maxLength: 20,
                minLength: 3,
              })}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            />
            {errors.name?.message && (
              <p className="text-sm text-red-500">
                {errors.name.message as string}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="johndoe@yourmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            />
            {errors.email?.message && (
              <p className="text-sm text-red-500">
                {errors.email.message as string}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Create a unique password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Password must be 6+ chars, with uppercase, lowercase, number, and symbol",
                },
              })}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            />
            {errors.password?.message && (
              <p className="text-sm text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty || !isValid}
            className="w-full px-6 py-3 rounded-md text-white shadow-md transition-all duration-300"
          >
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </section>
  );
};

export default CreateAccount;
