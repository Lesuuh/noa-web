import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface StartPageProps {
  name: string;
  examNumber: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StartPage = ({ name, examNumber, handleChange }: StartPageProps) => {
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/exam");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="flex flex-col items-center space-y-6">
        <img
          src="https://noa.gov.ng/assets/logo-nW5qDcRC.svg"
          alt="NOA Logo"
          className="w-40 md:w-60"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Welcome to the 2025 NOA Promotional Examination
        </h1>
        <p className="text-lg md:text-xl text-center font-light text-gray-600">
          Click the button below to start your exam
        </p>
        {!openForm && (
          <Button
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300"
            onClick={() => setOpenForm(true)}
          >
            Begin
          </Button>
        )}
      </div>

      {openForm && (
        <div className="mt-10 w-full max-w-md bg-white text-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Enter Your Details
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
                value={name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="examNumber" className="text-base font-medium">
                Exam Number:
              </label>
              <input
                id="examNumber"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                type="text"
                value={examNumber}
                onChange={handleChange}
                placeholder="Enter your Exam number"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
            >
              Start Exam
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StartPage;
