import { Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpgradeModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const onUpgrade = () => {
    navigate("/freemium");
  };
  if (!message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg">
              <Lock className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Upgrade to Continue
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              {/* <Sparkles className="w-4 h-4 text-emerald-600" /> */}
              <p className="text-sm font-semibold text-slate-800">
                Premium Benefits:
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                Unlimited practice tests
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                Access to 10,000+ questions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                Detailed explanations & analytics
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={onUpgrade || onClose}
              className="flex-1 px-4 py-2.5 rounded-lg  bg-emerald-600 to-cyan-600 text-white font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
