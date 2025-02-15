import { useState } from "react";
import { Link } from "react-router-dom";

const StartPage = () => {
  const [openForm, setOpenForm] = useState(false);
  return (
    <div className=" bg-slate-300 rounded-lg space-y-10 flex justify-center flex-col  items-center w-full h-screen">
      {/* <img src="../../public/noa.jpg" alt="" /> */}
      <img
        src="https://noa.gov.ng/assets/logo-nW5qDcRC.svg"
        alt=""
        className="text-white w-60"
      />
      <div
        className={`${
          openForm === true ? "hidden" : ""
        } flex flex-col items-center `}
      >
        <h2 className="text-2xl font-semibold">
          Welcome to 2025 NOA Promotional Examination
        </h2>
        <p className="text-center font-thin">
          Click the button below to start exam
        </p>
        <button
          className="my-2 mt-7 bg-blue-800 text-white px-6 py-2 rounded-sm"
          onClick={() => setOpenForm(true)}
        >
          Begin
        </button>
      </div>

      {openForm && (
        <div className="flex w-full max-w-[600px] p-4 flex-col space-y-4 items-center">
          <div className="flex flex-col w-full">
            <label htmlFor="name" className="text-base font-semibold">
              Name:
            </label>
            <input
              id="name"
              className="w-full px-2 py-2 rounded-sm"
              type="text"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="examNumber" className="text-base  font-semibold">
              Exam Number:
            </label>
            <input
              id="examNumber"
              className="w-full px-2 py-2 rounded-sm"
              type="number"
              placeholder="Enter your Exam number"
            />
          </div>
          <div>
            <Link to="/exam">
              <button className="my-2 mt-7 bg-blue-800 text-white px-6 py-2 rounded-sm">
                Start Exam
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartPage;
