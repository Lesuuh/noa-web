import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CreateAccountProps {
  create: () => void; // Define the type for the `create` prop
}

const CreateAccount: React.FC<CreateAccountProps> = ({ create }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create(); // Call the `create` function passed as a prop
  };
  const navigate = useNavigate();
  return (
    <div>
      <div className="mt-10  mx-auto w-full max-w-md bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-base font-medium">
              Name:
            </label>
            <input
              id="name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              type="text"
              //   value={name}
              //   onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-base font-medium">
              Email
            </label>
            <input
              id="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              type="email"
              //   value={examNumber}
              //   onChange={handleChange}
              placeholder="Email address"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="examNumber" className="text-base font-medium">
              Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              type="password"
              //   value={examNumber}
              //   onChange={handleChange}
              placeholder="Create password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
          >
            Create Account
          </Button>
        </form>

        <p className="text-[.9rem] text-right  mt-2">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-600 ">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
