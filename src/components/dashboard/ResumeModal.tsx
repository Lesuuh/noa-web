import { Target, X } from "@/lib/icons";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, SetStateAction } from "react";
// import { useNavigate } from "react-router-dom";
type ResumeModal = {
  openResume: boolean;
  setOpenResume: Dispatch<SetStateAction<boolean>>;
};
const ResumeModal: React.FC<ResumeModal> = ({ openResume, setOpenResume }) => {
  return (
    <AnimatePresence>
      {openResume && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-11/12 sm:w-[400px] rounded-xl p-6 relative shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpenResume(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {/* Modal content */}
            <div className="text-center space-y-4">
              <Target className="w-12 h-12 mx-auto text-cyan-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Resume Your Test
              </h2>
              {/* {lastAttempt ? (
                  <p className="text-slate-600 text-sm">
                    Last attempt: <strong>{lastAttempt.score || 50}%</strong> |{" "}
                    {lastAttempt.duration_minutes || 2} min |{" "}
                    {lastAttempt.date || "Wed 29 Oct"}
                  </p>
                ) : ( */}
              <p className="text-slate-600 text-sm">
                You have a test in progress. Resume from where you left off.
              </p>
              {/* )} */}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  // onClick={onResume}
                  className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" /> Resume Test
                </button>
                <button
                  onClick={() => setOpenResume(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors shadow-inner"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
