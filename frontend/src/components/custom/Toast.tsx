import React, { useState, useEffect } from "react";

interface ToastProps {
  type: "success" | "warning" | "error";
  message: string;
  duration: number;
}

const Toast: React.FC<ToastProps> = ({ type, message, duration }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-800";
    }
  };

  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={`fixed bottom-1.5 left-1.5 ${getBackgroundColor()} text-white px-4 py-2 rounded-md opacity-${
        showToast ? 100 : 0
      } transition-opacity duration-300 z-50`}
    >
      {message}
    </div>
  );
};

export default Toast;
