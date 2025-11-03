import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

interface LogoutModalProps {
  handleLogout: () => void;
  logoutModal: boolean;
  setLogoutModal: (state: boolean) => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  handleLogout,
  logoutModal,
  setLogoutModal,
}) => {
  return (
    <AnimatePresence>
      {logoutModal && (
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
            {/* Close Button */}
            <button
              onClick={() => setLogoutModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            {/* Content */}
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Confirm Logout
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to log out? You will need to sign in again
              to access your dashboard.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
