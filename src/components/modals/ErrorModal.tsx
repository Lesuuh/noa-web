import { XCircle } from "lucide-react";

export default function ErrorModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white/95 text-slate-900 rounded-lg shadow-2xl p-6 w-11/12 max-w-md animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="w-6 h-6 text-red-500" />
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
        </div>

        <p className="text-slate-700 mb-6">{message}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
