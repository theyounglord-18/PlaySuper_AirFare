import React from "react";
import { X, AlertTriangle } from "lucide-react";

const SearchError = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  // The container now uses a semi-transparent red background with a backdrop blur.
  // The left border provides a clear visual cue for an error alert.
  <div
    className="relative flex items-center justify-between p-4 mb-6 bg-red-500/10 backdrop-blur-md border-l-4 border-red-500 rounded-lg shadow-lg animate-fade-in-up"
    style={{ animationDuration: "0.3s" }}
    role="alert"
  >
    <div className="flex items-center">
      <AlertTriangle className="w-5 h-5 mr-3 text-red-400" />
      {/* The text color is updated for high contrast on the dark background. */}
      <p className="text-red-300 font-medium">{message}</p>
    </div>

    {/* The close button is restyled for the dark theme. */}
    <button
      onClick={onClose}
      className="p-1 text-red-400 rounded-full hover:bg-red-500/20 hover:text-red-200 transition-colors"
      aria-label="Close error message"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

export default SearchError;
